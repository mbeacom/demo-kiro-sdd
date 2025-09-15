import {
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
import type { Context } from './types'

export function createDataLoaders() {
  return {
    medicalRecords: createMedicalRecordsLoader(),
    photos: createPhotosLoader(),
    animalAdoptions: createAnimalAdoptionsLoader(),
    userAdoptions: createUserAdoptionsLoader(),
    volunteerByUserId: createVolunteerByUserIdLoader(),
    userById: createUserByIdLoader(),
    volunteerHours: createVolunteerHoursLoader(),
    volunteerAssignments: createVolunteerAssignmentsLoader(),
    animalById: createAnimalByIdLoader(),
  }
}

export function createContext(user?: Context['user']): Context {
  return {
    user,
    dataloaders: createDataLoaders(),
  }
}