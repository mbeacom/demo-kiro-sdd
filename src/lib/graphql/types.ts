import type {
  createMedicalRecordsLoader,
  createPhotosLoader,
  createAnimalAdoptionsLoader,
  createUserAdoptionsLoader,
  createVolunteerByUserIdLoader,
  createUserByIdLoader,
  createVolunteerHoursLoader,
  createVolunteerAssignmentsLoader,
  createAnimalByIdLoader,
} from './dataloaders'

export interface Context {
  user?: {
    userId: string
    email: string
    role: string
  } | null
  dataloaders: {
    medicalRecords: ReturnType<typeof createMedicalRecordsLoader>
    photos: ReturnType<typeof createPhotosLoader>
    animalAdoptions: ReturnType<typeof createAnimalAdoptionsLoader>
    userAdoptions: ReturnType<typeof createUserAdoptionsLoader>
    volunteerByUserId: ReturnType<typeof createVolunteerByUserIdLoader>
    userById: ReturnType<typeof createUserByIdLoader>
    volunteerHours: ReturnType<typeof createVolunteerHoursLoader>
    volunteerAssignments: ReturnType<typeof createVolunteerAssignmentsLoader>
    animalById: ReturnType<typeof createAnimalByIdLoader>
  }
}

import { Species, Gender, AnimalStatus, UserRole } from '@prisma/client'

export interface CreateAnimalInput {
  name: string
  species: Species
  breed: string
  age: number
  gender: Gender
  adoptionFee: number
  microchipId?: string
  behaviorNotes?: string
  specialNeeds?: string[]
}

export interface UpdateAnimalInput {
  name?: string
  species?: Species
  breed?: string
  age?: number
  gender?: Gender
  status?: AnimalStatus
  adoptionFee?: number
  microchipId?: string
  behaviorNotes?: string
  specialNeeds?: string[]
}

export interface CreateUserInput {
  email: string
  password: string
  role: UserRole
}

export interface LoginInput {
  email: string
  password: string
}