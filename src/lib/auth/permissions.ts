import { GraphQLError } from 'graphql'
import { UserRole } from '@prisma/client'
import type { Context } from '../graphql/types'

// Permission definitions
const PERMISSIONS = {
  'animals:read': ['ADMIN', 'STAFF'],
  'animals:write': ['ADMIN', 'STAFF'],
  'animals:delete': ['ADMIN'],
  'users:read': ['ADMIN', 'STAFF'],
  'users:write': ['ADMIN'],
  'users:delete': ['ADMIN'],
  'volunteers:read': ['ADMIN', 'STAFF'],
  'volunteers:write': ['ADMIN', 'STAFF'],
  'adoptions:read': ['ADMIN', 'STAFF'],
  'adoptions:write': ['ADMIN', 'STAFF'],
} as const

type Permission = keyof typeof PERMISSIONS

export function requireAuth(context: Context): asserts context is Context & { user: NonNullable<Context['user']> } {
  if (!context.user) {
    throw new GraphQLError('Authentication required', {
      extensions: {
        code: 'UNAUTHENTICATED'
      }
    })
  }
}

export function requireRole(context: Context, role: UserRole): void {
  requireAuth(context)
  
  if (context.user.role !== role) {
    throw new GraphQLError(`${role} role required`, {
      extensions: {
        code: 'FORBIDDEN',
        requiredRole: role,
        userRole: context.user.role
      }
    })
  }
}

export function requirePermission(context: Context, permission: Permission): void {
  requireAuth(context)
  
  const allowedRoles = PERMISSIONS[permission]
  if (!allowedRoles.includes(context.user.role as any)) {
    throw new GraphQLError(`Insufficient permissions for ${permission}`, {
      extensions: {
        code: 'FORBIDDEN',
        permission,
        userRole: context.user.role,
        allowedRoles
      }
    })
  }
}

export function hasPermission(context: Context, permission: Permission): boolean {
  if (!context.user) return false
  
  const allowedRoles = PERMISSIONS[permission]
  return allowedRoles.includes(context.user.role as any)
}

export function hasRole(context: Context, role: UserRole): boolean {
  return context.user?.role === role
}