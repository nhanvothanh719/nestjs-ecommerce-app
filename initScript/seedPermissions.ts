import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import { HTTPMethod } from 'src/shared/constants/permission.constant'
import { RoleName } from 'src/shared/constants/role.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

const prismaService = new PrismaService()

async function bootstrap() {
  const PORT = '3333'
  const SHOW_AVAILABLE_ROUTES = false

  const app = await NestFactory.create(AppModule)
  await app.listen(PORT)
  const server = app.getHttpAdapter().getInstance()
  const router = server.router

  const availableRoutes: { path: string; method: keyof typeof HTTPMethod; module: string; name: string }[] =
    router.stack
      .map((layer) => {
        if (layer.route) {
          const path = layer.route?.path
          const method = String(layer.route?.stack[0].method).toUpperCase() as keyof typeof HTTPMethod
          const module = path.split('/')[1]
          const name = `${method} ${path}`
          return { path, method, name, module }
        }
      })
      .filter((item) => item !== undefined)
  if (SHOW_AVAILABLE_ROUTES) console.log('>>> Available routes: ', availableRoutes)

  const savedPermissions = await prismaService.permission.findMany({
    where: { deletedAt: null },
  })

  const availableRoutesMap: Record<string, (typeof availableRoutes)[0]> = availableRoutes.reduce((acc, item) => {
    acc[`${item.method}-${item.path}`] = item
    return acc
  }, {})
  const savedPermissionsMap: Record<string, (typeof savedPermissions)[0]> = savedPermissions.reduce((acc, item) => {
    acc[`${item.method}-${item.path}`] = item
    return acc
  }, {})

  // Xoá các permissions mà path không còn tồn tại trong available routes
  console.log('>>> Handle deleting predicated permission...')
  const toDeletePermissions = savedPermissions.filter((item) => {
    return !availableRoutesMap[`${item.method}-${item.path}`]
  })
  if (toDeletePermissions.length > 0) {
    const deletedPermissions = await prismaService.permission.deleteMany({
      where: {
        id: {
          in: toDeletePermissions.map((item) => item.id),
        },
      },
    })
    console.log('>>> Total of deleted permissions: ', deletedPermissions.count)
  } else {
    console.log('>>> No permissions to delete!')
  }

  // Thêm các permissions với path là các routes mới được thêm vào
  console.log('>>> Handle adding new permission...')
  const toAddRoutes = availableRoutes.filter((item) => {
    return !savedPermissionsMap[`${item.method}-${item.path}`]
  })
  if (toAddRoutes.length > 0) {
    const addedPermissions = await prismaService.permission.createMany({
      data: toAddRoutes,
      skipDuplicates: true,
    })
    console.log('>>> Total of added permissions: ', addedPermissions.count)
  } else {
    console.log('>>> No permissions to add!')
  }

  // Lấy danh sách permissions từ database (sau khi update)
  const currentPermissions = await prismaService.permission.findMany({ where: { deletedAt: null } })
  // Update các permissions của ADMIN role
  const adminRole = await prismaService.role.findFirstOrThrow({
    where: {
      name: RoleName.Admin,
      deletedAt: null,
    },
  })
  await prismaService.role.update({
    where: { id: adminRole.id },
    data: {
      permissions: {
        set: currentPermissions.map((item) => ({ id: item.id })),
      },
    },
  })
  console.log('>>> Update permissions for Admin role successfully')

  // Shut down NestJS application and HTTP server
  await app.close()
  // MEMO: Exit code 0 indicates successful executions
  process.exit(0)
}
bootstrap()
