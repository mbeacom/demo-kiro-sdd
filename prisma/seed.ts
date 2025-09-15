import { PrismaClient, UserRole, Species, Gender, AnimalStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shelter.com' },
    update: {},
    create: {
      email: 'admin@shelter.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  })

  // Create staff user
  const staffPassword = await bcrypt.hash('staff123', 12)
  const staff = await prisma.user.upsert({
    where: { email: 'staff@shelter.com' },
    update: {},
    create: {
      email: 'staff@shelter.com',
      password: staffPassword,
      role: UserRole.STAFF,
    },
  })

  // Create volunteer user
  const volunteerPassword = await bcrypt.hash('volunteer123', 12)
  const volunteerUser = await prisma.user.upsert({
    where: { email: 'volunteer@shelter.com' },
    update: {},
    create: {
      email: 'volunteer@shelter.com',
      password: volunteerPassword,
      role: UserRole.VOLUNTEER,
    },
  })

  // Create volunteer profile
  const volunteer = await prisma.volunteer.upsert({
    where: { userId: volunteerUser.id },
    update: {},
    create: {
      userId: volunteerUser.id,
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '555-0123',
      address: '123 Main St, City, State 12345',
      emergencyContact: 'John Doe - 555-0124',
      skills: ['Dog Walking', 'Cat Care', 'Administrative'],
      availability: ['Monday Morning', 'Wednesday Evening', 'Saturday All Day'],
    },
  })

  // Create sample animals
  const animals = [
    {
      name: 'Buddy',
      species: Species.DOG,
      breed: 'Golden Retriever',
      age: 3,
      gender: Gender.MALE,
      status: AnimalStatus.AVAILABLE,
      adoptionFee: 150.0,
      behaviorNotes: 'Friendly and energetic. Good with children.',
      specialNeeds: ['Daily exercise', 'Regular grooming'],
    },
    {
      name: 'Whiskers',
      species: Species.CAT,
      breed: 'Domestic Shorthair',
      age: 2,
      gender: Gender.FEMALE,
      status: AnimalStatus.AVAILABLE,
      adoptionFee: 75.0,
      behaviorNotes: 'Independent but affectionate. Prefers quiet environments.',
      specialNeeds: ['Indoor only'],
    },
    {
      name: 'Max',
      species: Species.DOG,
      breed: 'German Shepherd Mix',
      age: 5,
      gender: Gender.MALE,
      status: AnimalStatus.MEDICAL_HOLD,
      adoptionFee: 200.0,
      behaviorNotes: 'Protective and loyal. Needs experienced owner.',
      specialNeeds: ['Medication for hip dysplasia', 'Limited exercise'],
    },
  ]

  for (const animalData of animals) {
    const existingAnimal = await prisma.animal.findFirst({
      where: { name: animalData.name },
    })
    
    if (!existingAnimal) {
      await prisma.animal.create({
        data: animalData,
      })
    }
  }

  console.log('✅ Database seeded successfully!')
  console.log('👤 Admin user: admin@shelter.com / admin123')
  console.log('👤 Staff user: staff@shelter.com / staff123')
  console.log('👤 Volunteer user: volunteer@shelter.com / volunteer123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })