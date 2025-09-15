import DataLoader from 'dataloader'
import { prisma } from '../prisma'

// Medical Records DataLoader Factory
export const createMedicalRecordsLoader = () => new DataLoader(async (animalIds: readonly string[]) => {
  const records = await prisma.medicalRecord.findMany({
    where: { animalId: { in: [...animalIds] } },
  })
  
  const recordsByAnimalId = records.reduce((acc, record) => {
    if (!acc[record.animalId]) acc[record.animalId] = []
    acc[record.animalId].push(record)
    return acc
  }, {} as Record<string, typeof records>)
  
  return animalIds.map(id => recordsByAnimalId[id] || [])
})

// Photos DataLoader Factory
export const createPhotosLoader = () => new DataLoader(async (animalIds: readonly string[]) => {
  const photos = await prisma.photo.findMany({
    where: { animalId: { in: [...animalIds] } },
  })
  
  const photosByAnimalId = photos.reduce((acc, photo) => {
    if (!acc[photo.animalId]) acc[photo.animalId] = []
    acc[photo.animalId].push(photo)
    return acc
  }, {} as Record<string, typeof photos>)
  
  return animalIds.map(id => photosByAnimalId[id] || [])
})

// Animal Adoptions DataLoader Factory
export const createAnimalAdoptionsLoader = () => new DataLoader(async (animalIds: readonly string[]) => {
  const adoptions = await prisma.adoption.findMany({
    where: { animalId: { in: [...animalIds] } },
  })
  
  const adoptionsByAnimalId = adoptions.reduce((acc, adoption) => {
    if (!acc[adoption.animalId]) acc[adoption.animalId] = []
    acc[adoption.animalId].push(adoption)
    return acc
  }, {} as Record<string, typeof adoptions>)
  
  return animalIds.map(id => adoptionsByAnimalId[id] || [])
})

// User Adoptions DataLoader Factory
export const createUserAdoptionsLoader = () => new DataLoader(async (userIds: readonly string[]) => {
  const adoptions = await prisma.adoption.findMany({
    where: { adopterId: { in: [...userIds] } },
  })
  
  const adoptionsByUserId = adoptions.reduce((acc, adoption) => {
    if (!acc[adoption.adopterId]) acc[adoption.adopterId] = []
    acc[adoption.adopterId].push(adoption)
    return acc
  }, {} as Record<string, typeof adoptions>)
  
  return userIds.map(id => adoptionsByUserId[id] || [])
})

// Volunteer by User ID DataLoader Factory
export const createVolunteerByUserIdLoader = () => new DataLoader(async (userIds: readonly string[]) => {
  const volunteers = await prisma.volunteer.findMany({
    where: { userId: { in: [...userIds] } },
  })
  
  const volunteersByUserId = volunteers.reduce((acc, volunteer) => {
    acc[volunteer.userId] = volunteer
    return acc
  }, {} as Record<string, typeof volunteers[0] | undefined>)
  
  return userIds.map(id => volunteersByUserId[id] || null)
})

// User by ID DataLoader Factory
export const createUserByIdLoader = () => new DataLoader(async (userIds: readonly string[]) => {
  const users = await prisma.user.findMany({
    where: { id: { in: [...userIds] } },
  })
  
  const usersById = users.reduce((acc, user) => {
    acc[user.id] = user
    return acc
  }, {} as Record<string, typeof users[0] | undefined>)
  
  return userIds.map(id => usersById[id] || null)
})

// Volunteer Hours DataLoader Factory
export const createVolunteerHoursLoader = () => new DataLoader(async (volunteerIds: readonly string[]) => {
  const hours = await prisma.volunteerHour.findMany({
    where: { volunteerId: { in: [...volunteerIds] } },
  })
  
  const hoursByVolunteerId = hours.reduce((acc, hour) => {
    if (!acc[hour.volunteerId]) acc[hour.volunteerId] = []
    acc[hour.volunteerId].push(hour)
    return acc
  }, {} as Record<string, typeof hours>)
  
  return volunteerIds.map(id => hoursByVolunteerId[id] || [])
})

// Volunteer Assignments DataLoader Factory
export const createVolunteerAssignmentsLoader = () => new DataLoader(async (volunteerIds: readonly string[]) => {
  const assignments = await prisma.assignment.findMany({
    where: { volunteerId: { in: [...volunteerIds] } },
  })
  
  const assignmentsByVolunteerId = assignments.reduce((acc, assignment) => {
    if (!acc[assignment.volunteerId]) acc[assignment.volunteerId] = []
    acc[assignment.volunteerId].push(assignment)
    return acc
  }, {} as Record<string, typeof assignments>)
  
  return volunteerIds.map(id => assignmentsByVolunteerId[id] || [])
})

// Animal by ID DataLoader Factory
export const createAnimalByIdLoader = () => new DataLoader(async (animalIds: readonly string[]) => {
  const animals = await prisma.animal.findMany({
    where: { id: { in: [...animalIds] } },
  })
  
  const animalsById = animals.reduce((acc, animal) => {
    acc[animal.id] = animal
    return acc
  }, {} as Record<string, typeof animals[0] | undefined>)
  
  return animalIds.map(id => animalsById[id] || null)
})