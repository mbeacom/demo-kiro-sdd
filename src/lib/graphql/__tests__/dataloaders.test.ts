import { createMedicalRecordsLoader, createPhotosLoader } from '../dataloaders'

// Mock Prisma
jest.mock('../../prisma', () => ({
  prisma: {
    medicalRecord: {
      findMany: jest.fn(),
    },
    photo: {
      findMany: jest.fn(),
    },
  },
}))

import { prisma } from '../../prisma'

describe('DataLoaders', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Medical Records Loader', () => {
    it('should batch multiple requests into a single database query', async () => {
      const mockRecords = [
        { id: '1', animalId: 'animal1', notes: 'Test 1' },
        { id: '2', animalId: 'animal2', notes: 'Test 2' },
      ]

      ;(prisma.medicalRecord.findMany as jest.Mock).mockResolvedValue(mockRecords)

      const loader = createMedicalRecordsLoader()

      // Make multiple requests
      const promises = [
        loader.load('animal1'),
        loader.load('animal2'),
        loader.load('animal1'), // Duplicate should be cached
      ]

      const results = await Promise.all(promises)

      // Should only make one database call
      expect(prisma.medicalRecord.findMany).toHaveBeenCalledTimes(1)
      expect(prisma.medicalRecord.findMany).toHaveBeenCalledWith({
        where: { animalId: { in: ['animal1', 'animal2'] } },
      })

      // Results should be correctly mapped
      expect(results[0]).toEqual([mockRecords[0]])
      expect(results[1]).toEqual([mockRecords[1]])
      expect(results[2]).toEqual([mockRecords[0]]) // Cached result
    })
  })

  describe('Photos Loader', () => {
    it('should handle empty results correctly', async () => {
      ;(prisma.photo.findMany as jest.Mock).mockResolvedValue([])

      const loader = createPhotosLoader()
      const result = await loader.load('nonexistent-animal')

      expect(result).toEqual([])
      expect(prisma.photo.findMany).toHaveBeenCalledWith({
        where: { animalId: { in: ['nonexistent-animal'] } },
      })
    })
  })
})