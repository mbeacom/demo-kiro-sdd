# Animal Shelter Management System

A comprehensive web application for managing animal shelters, built with Next.js 14, TypeScript, Material-UI, GraphQL, and Prisma.

## Features

- **Animal Management**: Track animals, medical records, photos, and adoption status
- **Volunteer Management**: Manage volunteer profiles, schedules, and hour tracking
- **Adoption Process**: Handle adoption applications and workflow
- **Role-Based Access Control**: Admin, Staff, Volunteer, and Adopter roles
- **GraphQL API**: Secure and efficient data access
- **Material-UI Components**: Modern and responsive user interface

## Tech Stack

- **Frontend**: Next.js 14, React 18, Material-UI v5, Apollo Client
- **Backend**: Next.js API Routes, Apollo Server, GraphQL
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT tokens
- **TypeScript**: Full type safety throughout the application

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or use Prisma's local development database)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd animal-shelter-management
```

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and update the database connection string and other variables as needed.

1. Set up the database:

```bash
# Generate Prisma client
npm run db:generate

# Push the schema to the database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

1. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### GraphQL Playground

The GraphQL API is available at `http://localhost:3000/api/graphql`

### Default Users

After seeding, you can log in with these test accounts:

- **Admin**: `admin@shelter.com` / `admin123`
- **Staff**: `staff@shelter.com` / `staff123`
- **Volunteer**: `volunteer@shelter.com` / `volunteer123`

## Database Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## Project Structure

```bash
src/
├── app/                    # Next.js app directory
│   ├── api/graphql/       # GraphQL API endpoint
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── lib/                   # Shared utilities
│   ├── prisma.ts          # Prisma client instance
│   ├── apollo-server.ts   # Apollo Server configuration
│   ├── prisma.ts          # Prisma client instance
│   ├── theme.ts           # Material-UI theme
│   └── graphql/           # GraphQL schema and resolvers
│       ├── typeDefs.ts    # GraphQL type definitions
│       └── resolvers.ts   # GraphQL resolvers
prisma/
├── schema.prisma          # Database schema
└── seed.ts               # Database seeding script
```

## Development

This project follows the requirements and design specifications outlined in:

- `.kiro/specs/animal-shelter-management/requirements.md`
- `.kiro/specs/animal-shelter-management/design.md`
- `.kiro/specs/animal-shelter-management/tasks.md`

## License

This project is licensed under the MIT License.
