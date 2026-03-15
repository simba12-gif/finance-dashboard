import { prisma } from './prisma.js'

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  })
  console.log('Created user:', user)
  console.log('Copy this ID into exchange-token/route.js:', user.id)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())