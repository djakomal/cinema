const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, '.Env') })

async function seed() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })

  try {
    await prisma.$connect()
    console.log('✅ Connecté à Supabase')

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('admin123', salt)

    const admins = [
      { username: 'admin', email: 'admin@grct-cinema.com', password: hashedPassword, role: 'admin' },
      { username: 'admin2', email: 'admin2@grct-cinema.com', password: hashedPassword, role: 'admin' }
    ]

    for (const admin of admins) {
      const existing = await prisma.user.findUnique({ where: { username: admin.username } })
      if (!existing) {
        await prisma.user.create({ data: admin })
        console.log(`✅ Admin "${admin.username}" créé`)
      } else {
        console.log(`⚠️ Admin "${admin.username}" existe déjà`)
      }
    }

    console.log('✅ Seed terminé')
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
