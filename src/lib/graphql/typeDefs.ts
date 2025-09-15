import { gql } from 'graphql-tag'

export const typeDefs = gql`
  # Enums
  enum UserRole {
    ADMIN
    STAFF
    VOLUNTEER
    ADOPTER
  }

  enum AnimalStatus {
    AVAILABLE
    ADOPTED
    MEDICAL_HOLD
    BEHAVIORAL_HOLD
    PENDING_ADOPTION
    DECEASED
  }

  enum Species {
    DOG
    CAT
    RABBIT
    BIRD
    OTHER
  }

  enum Gender {
    MALE
    FEMALE
    UNKNOWN
  }

  enum AdoptionStatus {
    PENDING
    APPROVED
    COMPLETED
    REJECTED
    CANCELLED
  }

  enum PaymentStatus {
    PENDING
    PAID
    REFUNDED
  }

  # Types
  type User {
    id: ID!
    email: String!
    role: UserRole!
    createdAt: String!
    updatedAt: String!
    volunteer: Volunteer
    adoptions: [Adoption!]!
  }

  type Animal {
    id: ID!
    name: String!
    species: Species!
    breed: String!
    age: Int!
    gender: Gender!
    intakeDate: String!
    status: AnimalStatus!
    adoptionFee: Float!
    microchipId: String
    behaviorNotes: String
    specialNeeds: [String!]!
    createdAt: String!
    updatedAt: String!
    medicalRecords: [MedicalRecord!]!
    photos: [Photo!]!
    adoptions: [Adoption!]!
  }

  type Volunteer {
    id: ID!
    userId: String!
    firstName: String!
    lastName: String!
    phone: String
    address: String
    emergencyContact: String
    skills: [String!]!
    availability: [String!]!
    createdAt: String!
    updatedAt: String!
    user: User!
    volunteerHours: [VolunteerHour!]!
    assignments: [Assignment!]!
  }

  type Adoption {
    id: ID!
    animalId: String!
    adopterId: String!
    applicationDate: String!
    approvalDate: String
    completionDate: String
    status: AdoptionStatus!
    adoptionFee: Float!
    paymentStatus: PaymentStatus!
    notes: String
    followUpDate: String
    createdAt: String!
    updatedAt: String!
    animal: Animal!
    adopter: User!
  }

  type MedicalRecord {
    id: ID!
    animalId: String!
    recordType: String!
    description: String!
    veterinarian: String
    cost: Float
    recordDate: String!
    createdAt: String!
    animal: Animal!
  }

  type Photo {
    id: ID!
    animalId: String!
    url: String!
    caption: String
    isPrimary: Boolean!
    createdAt: String!
    animal: Animal!
  }

  type VolunteerHour {
    id: ID!
    volunteerId: String!
    date: String!
    hours: Float!
    activity: String!
    notes: String
    createdAt: String!
    volunteer: Volunteer!
  }

  type Assignment {
    id: ID!
    volunteerId: String!
    title: String!
    description: String
    scheduledDate: String!
    duration: Int!
    status: String!
    createdAt: String!
    volunteer: Volunteer!
  }

  # Input Types
  input CreateAnimalInput {
    name: String!
    species: Species!
    breed: String!
    age: Int!
    gender: Gender!
    adoptionFee: Float!
    microchipId: String
    behaviorNotes: String
    specialNeeds: [String!]
  }

  input UpdateAnimalInput {
    name: String
    species: Species
    breed: String
    age: Int
    gender: Gender
    status: AnimalStatus
    adoptionFee: Float
    microchipId: String
    behaviorNotes: String
    specialNeeds: [String!]
  }

  input CreateUserInput {
    email: String!
    password: String!
    role: UserRole!
  }

  # Queries
  type Query {
    animals: [Animal!]!
    animal(id: ID!): Animal
    users: [User!]!
    user(id: ID!): User
    volunteers: [Volunteer!]!
    volunteer(id: ID!): Volunteer
    adoptions: [Adoption!]!
    adoption(id: ID!): Adoption
    me: User
  }

  # Mutations
  type Mutation {
    createAnimal(input: CreateAnimalInput!): Animal!
    updateAnimal(id: ID!, input: UpdateAnimalInput!): Animal!
    deleteAnimal(id: ID!): Boolean!
    createUser(input: CreateUserInput!): User!
    login(email: String!, password: String!): AuthPayload!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`