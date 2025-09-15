import { prisma } from '../prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import type { Context, CreateAnimalInput, UpdateAnimalInput, CreateUserInput, LoginInput } from './types'
import { requireAuth, requirePermission, requireRole } from '../auth/permissions'
import { UserRole } from '@prisma/client'

export const resolvers = {
  Query: {
    animals: async (_: unknown, __: unknown, context: Context) => {
      // Allow public access to basic animal info for adopters, full access for staff
      const includeFullDetails = context.user && ['ADMIN', 'STAFF'].includes(context.user.role)

      if (includeFullDetails) {
        return await prisma.animal.findMany({
          include: {
            medicalRecords: true,
            photos: true,
            adoptions: true,
          },
        })
      } else {
        return await prisma.animal.findMany({
          include: {
            photos: true,
          },
        })
      }
    },

    animal: async (_: unknown, { id }: { id: string }, context: Context) => {
      const includeFullDetails = context.user && ['ADMIN', 'STAFF'].includes(context.user.role)

      if (includeFullDetails) {
        return await prisma.animal.findUnique({
          where: { id },
          include: {
            medicalRecords: true,
            photos: true,
            adoptions: true,
          },
        })
      } else {
        return await prisma.animal.findUnique({
          where: { id },
          include: {
            photos: true,
          },
        })
      }
    },

    users: async (_: unknown, __: unknown, context: Context) => {
      requirePermission(context, 'users:read')

      return await prisma.user.findMany({
        include: {
          volunteer: true,
          adoptions: true,
        },
      })
    },

    user: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context)

      // Users can only view their own profile unless they're staff/admin
      if (context.user.userId !== id) {
        requirePermission(context, 'users:read')
      }

      return await prisma.user.findUnique({
        where: { id },
        include: {
          volunteer: true,
          adoptions: true,
        },
      })
    },

    volunteers: async (_: unknown, __: unknown, context: Context) => {
      requirePermission(context, 'volunteers:read')

      return await prisma.volunteer.findMany({
        include: {
          user: true,
          volunteerHours: true,
          assignments: true,
        },
      })
    },

    volunteer: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context)

      const volunteer = await prisma.volunteer.findUnique({
        where: { id },
        include: {
          user: true,
          volunteerHours: true,
          assignments: true,
        },
      })

      // Volunteers can view their own profile, staff can view all
      if (volunteer?.userId !== context.user.userId) {
        requirePermission(context, 'volunteers:read')
      }

      return volunteer
    },

    adoptions: async (_: unknown, __: unknown, context: Context) => {
      requireAuth(context)

      // Adopters can only see their own adoptions, staff can see all
      if (context.user.role === 'ADOPTER') {
        return await prisma.adoption.findMany({
          where: { adopterId: context.user.userId },
          include: {
            animal: true,
            adopter: true,
          },
        })
      }

      requirePermission(context, 'adoptions:read')
      return await prisma.adoption.findMany({
        include: {
          animal: true,
          adopter: true,
        },
      })
    },

    adoption: async (_: unknown, { id }: { id: string }, context: Context) => {
      requireAuth(context)

      const adoption = await prisma.adoption.findUnique({
        where: { id },
        include: {
          animal: true,
          adopter: true,
        },
      })

      // Adopters can only view their own adoptions
      if (adoption?.adopterId !== context.user.userId) {
        requirePermission(context, 'adoptions:read')
      }

      return adoption
    },

    me: async (_: unknown, __: unknown, { user }: Context) => {
      if (!user) return null
      return await prisma.user.findUnique({
        where: { id: user.userId },
        include: {
          volunteer: true,
          adoptions: true,
        },
      })
    },
  },

  Mutation: {
    createAnimal: async (_: unknown, { input }: { input: CreateAnimalInput }, context: Context) => {
      requirePermission(context, 'animals:write')

      // Validate input
      if (input.age < 0) {
        throw new GraphQLError('Age must be a positive number', {
          extensions: {
            code: 'BAD_USER_INPUT',
            field: 'age'
          }
        })
      }

      if (input.adoptionFee < 0) {
        throw new GraphQLError('Adoption fee must be a positive number', {
          extensions: {
            code: 'BAD_USER_INPUT',
            field: 'adoptionFee'
          }
        })
      }

      try {
        return await prisma.animal.create({
          data: input,
          include: {
            medicalRecords: true,
            photos: true,
            adoptions: true,
          },
        })
      } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('microchipId')) {
          throw new GraphQLError('An animal with this microchip ID already exists', {
            extensions: {
              code: 'BAD_USER_INPUT',
              field: 'microchipId'
            }
          })
        }
        throw error
      }
    },

    updateAnimal: async (_: unknown, { id, input }: { id: string; input: UpdateAnimalInput }, context: Context) => {
      requirePermission(context, 'animals:write')

      // Validate input
      if (input.age !== undefined && input.age < 0) {
        throw new GraphQLError('Age must be a positive number', {
          extensions: {
            code: 'BAD_USER_INPUT',
            field: 'age'
          }
        })
      }

      if (input.adoptionFee !== undefined && input.adoptionFee < 0) {
        throw new GraphQLError('Adoption fee must be a positive number', {
          extensions: {
            code: 'BAD_USER_INPUT',
            field: 'adoptionFee'
          }
        })
      }

      try {
        return await prisma.animal.update({
          where: { id },
          data: input,
          include: {
            medicalRecords: true,
            photos: true,
            adoptions: true,
          },
        })
      } catch (error: any) {
        if (error.code === 'P2025') {
          throw new GraphQLError('Animal not found', {
            extensions: {
              code: 'BAD_USER_INPUT',
              field: 'id'
            }
          })
        }
        if (error.code === 'P2002' && error.meta?.target?.includes('microchipId')) {
          throw new GraphQLError('An animal with this microchip ID already exists', {
            extensions: {
              code: 'BAD_USER_INPUT',
              field: 'microchipId'
            }
          })
        }
        throw error
      }
    },

    deleteAnimal: async (_: unknown, { id }: { id: string }, context: Context) => {
      requirePermission(context, 'animals:delete')

      try {
        await prisma.animal.delete({
          where: { id },
        })
        return true
      } catch (error: any) {
        if (error.code === 'P2003') {
          throw new GraphQLError('Cannot delete animal with existing adoption records', {
            extensions: {
              code: 'BAD_USER_INPUT',
              field: 'id',
              reason: 'FOREIGN_KEY_CONSTRAINT'
            }
          })
        }
        if (error.code === 'P2025') {
          throw new GraphQLError('Animal not found', {
            extensions: {
              code: 'BAD_USER_INPUT',
              field: 'id'
            }
          })
        }
        throw error
      }
    },

    createUser: async (_: unknown, { input }: { input: CreateUserInput }, context: Context) => {
      // Only admins can create users with ADMIN or STAFF roles
      if (['ADMIN', 'STAFF'].includes(input.role)) {
        requireRole(context, UserRole.ADMIN)
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email }
      })

      if (existingUser) {
        throw new GraphQLError('User with this email already exists', {
          extensions: {
            code: 'BAD_USER_INPUT',
            field: 'email'
          }
        })
      }

      const hashedPassword = await bcrypt.hash(input.password, 12)
      return await prisma.user.create({
        data: {
          ...input,
          password: hashedPassword,
        },
        include: {
          volunteer: true,
          adoptions: true,
        },
      })
    },

    login: async (_: unknown, { email, password }: LoginInput) => {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          volunteer: true,
          adoptions: true,
        },
      })

      if (!user) {
        throw new GraphQLError('Invalid credentials', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        throw new GraphQLError('Invalid credentials', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      const jwtSecret = process.env.NEXTAUTH_SECRET
      if (!jwtSecret) {
        throw new GraphQLError('JWT secret not configured', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR'
          }
        })
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: '7d' }
      )

      return {
        token,
        user,
      }
    },
  },

  // Resolvers for nested fields using DataLoaders
  Animal: {
    medicalRecords: async (parent: { id: string }, _: unknown, context: Context) => {
      return await context.dataloaders.medicalRecords.load(parent.id)
    },
    photos: async (parent: { id: string }, _: unknown, context: Context) => {
      return await context.dataloaders.photos.load(parent.id)
    },
    adoptions: async (parent: { id: string }, _: unknown, context: Context) => {
      return await context.dataloaders.animalAdoptions.load(parent.id)
    },
  },

  User: {
    volunteer: async (parent: { id: string }, _: unknown, context: Context) => {
      return await context.dataloaders.volunteerByUserId.load(parent.id)
    },
    adoptions: async (parent: { id: string }, _: unknown, context: Context) => {
      return await context.dataloaders.userAdoptions.load(parent.id)
    },
  },

  Volunteer: {
    user: async (parent: { userId: string }, _: unknown, context: Context) => {
      return await context.dataloaders.userById.load(parent.userId)
    },
    volunteerHours: async (parent: { id: string }, _: unknown, context: Context) => {
      return await context.dataloaders.volunteerHours.load(parent.id)
    },
    assignments: async (parent: { id: string }, _: unknown, context: Context) => {
      return await context.dataloaders.volunteerAssignments.load(parent.id)
    },
  },

  Adoption: {
    animal: async (parent: { animalId: string }, _: unknown, context: Context) => {
      return await context.dataloaders.animalById.load(parent.animalId)
    },
    adopter: async (parent: { adopterId: string }, _: unknown, context: Context) => {
      return await context.dataloaders.userById.load(parent.adopterId)
    },
  },
}