# DataLoader Performance Optimization

## Problem: N+1 Query Issue

Before implementing DataLoaders, fetching animals with their medical records would result in:

```
Query: Get 10 animals with medical records

Without DataLoader:
1. SELECT * FROM animals LIMIT 10           (1 query)
2. SELECT * FROM medical_records WHERE animal_id = 'animal1'  (1 query)
3. SELECT * FROM medical_records WHERE animal_id = 'animal2'  (1 query)
4. SELECT * FROM medical_records WHERE animal_id = 'animal3'  (1 query)
...
11. SELECT * FROM medical_records WHERE animal_id = 'animal10' (1 query)

Total: 11 queries
```

## Solution: DataLoader Batching

With DataLoaders, the same request becomes:

```
Query: Get 10 animals with medical records

With DataLoader:
1. SELECT * FROM animals LIMIT 10           (1 query)
2. SELECT * FROM medical_records WHERE animal_id IN ('animal1', 'animal2', ..., 'animal10')  (1 query)

Total: 2 queries
```

## Performance Impact

- **Query Reduction**: From 11 queries to 2 queries (82% reduction)
- **Network Latency**: Reduced database round trips
- **Memory Efficiency**: Caching prevents duplicate requests within the same GraphQL operation
- **Scalability**: Performance improvement scales with the number of related records

## GraphQL Query Example

```graphql
query GetAnimalsWithDetails {
  animals {
    id
    name
    medicalRecords {
      id
      notes
      date
    }
    photos {
      id
      url
    }
    adoptions {
      id
      status
      adopter {
        name
        email
      }
    }
  }
}
```

Without DataLoaders: **1 + (N × 3) + (N × adopters)** queries
With DataLoaders: **5 queries maximum** (animals, medical records, photos, adoptions, users)

## Implementation Benefits

1. **Automatic Batching**: DataLoader automatically batches requests made within the same tick
2. **Caching**: Prevents duplicate requests for the same key within a single GraphQL operation
3. **Type Safety**: Full TypeScript support with proper return types
4. **Fresh Context**: New DataLoader instances per request prevent cache leaks between users