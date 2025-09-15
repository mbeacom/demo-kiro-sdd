# GraphQL Error Handling

## Error Types and Codes

### Authentication Errors
- **Code**: `UNAUTHENTICATED`
- **When**: User is not logged in but tries to access protected resources
- **Example**: Accessing user profile without authentication

### Authorization Errors
- **Code**: `FORBIDDEN`
- **When**: User lacks required permissions or role
- **Extensions**: Includes `permission`, `userRole`, `allowedRoles`, or `requiredRole`
- **Example**: ADOPTER trying to delete an animal

### Input Validation Errors
- **Code**: `BAD_USER_INPUT`
- **When**: Invalid input data provided
- **Extensions**: Includes `field` to identify problematic field
- **Examples**:
  - Negative age or adoption fee
  - Duplicate email or microchip ID
  - Invalid animal ID for updates/deletes

### Database Constraint Errors
- **Code**: `BAD_USER_INPUT` with `reason: 'FOREIGN_KEY_CONSTRAINT'`
- **When**: Attempting operations that violate database constraints
- **Example**: Deleting an animal that has adoption records

## Client-Side Error Handling

```typescript
import { ApolloError } from '@apollo/client'

function handleGraphQLError(error: ApolloError) {
  error.graphQLErrors.forEach(({ message, extensions }) => {
    switch (extensions?.code) {
      case 'UNAUTHENTICATED':
        // Redirect to login
        router.push('/login')
        break
        
      case 'FORBIDDEN':
        // Show permission denied message
        toast.error(`Access denied: ${message}`)
        break
        
      case 'BAD_USER_INPUT':
        // Highlight specific field if provided
        if (extensions.field) {
          setFieldError(extensions.field, message)
        } else {
          toast.error(message)
        }
        break
        
      default:
        toast.error('An unexpected error occurred')
    }
  })
}
```

## Error Response Examples

### Authentication Required
```json
{
  "errors": [
    {
      "message": "Authentication required",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

### Insufficient Permissions
```json
{
  "errors": [
    {
      "message": "Insufficient permissions for animals:delete",
      "extensions": {
        "code": "FORBIDDEN",
        "permission": "animals:delete",
        "userRole": "ADOPTER",
        "allowedRoles": ["ADMIN"]
      }
    }
  ]
}
```

### Validation Error
```json
{
  "errors": [
    {
      "message": "Age must be a positive number",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "field": "age"
      }
    }
  ]
}
```

### Constraint Violation
```json
{
  "errors": [
    {
      "message": "Cannot delete animal with existing adoption records",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "field": "id",
        "reason": "FOREIGN_KEY_CONSTRAINT"
      }
    }
  ]
}
```

## Best Practices

1. **Always use GraphQLError** instead of generic Error
2. **Include specific error codes** for programmatic handling
3. **Provide field information** for validation errors
4. **Include context** in extensions for debugging
5. **Handle Prisma errors** and convert to meaningful messages
6. **Don't expose internal details** in production error messages