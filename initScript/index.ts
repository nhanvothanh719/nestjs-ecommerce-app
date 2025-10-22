import envConfig from 'src/shared/config'
import { RoleName, TOTAL_ROLES } from 'src/shared/constants/role.constant'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

const prisma = new PrismaService()
const hashing = new HashingService()

const main = async () => {
  const roleCount = await prisma.role.count()
  if (roleCount === TOTAL_ROLES) {
    throw new Error('All roles have been inserted into database')
  }

  const roles = await prisma.role.createMany({
    data: [
      {
        name: RoleName.Admin,
        description: 'Admin Role',
      },
      {
        name: RoleName.Seller,
        description: 'Seller Role',
      },
      {
        name: RoleName.Client,
        description: 'Client Role',
      },
    ],
  })

  const adminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.Admin,
    },
  })

  const hashedPassword = await hashing.hash(envConfig.ADMIN_USER_PASSWORD)
  const adminUser = await prisma.user.create({
    data: {
      email: envConfig.ADMIN_USER_EMAIL,
      password: hashedPassword,
      name: envConfig.ADMIN_USER_NAME,
      phoneNumber: envConfig.ADMIN_USER_PHONE_NUMBER,
      roleId: adminRole.id,
    },
  })

  return {
    createdRoleCount: roles.count,
    adminUser,
  }
}

main()
  .then(({ adminUser, createdRoleCount }) => {
    console.log(`Inserted ${createdRoleCount} roles`)
    console.log(`Created admin user: ${adminUser.name}`)
  })
  .catch(console.error)
