import { INestApplicationContext } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { Server, ServerOptions, Socket } from 'socket.io'
import envConfig from 'src/shared/config'
import { USE_SOCKET_ROOM } from 'src/shared/constants/others.constants'
import { generateSocketRoomName } from 'src/shared/helpers'
import { SharedUserSocketRepository } from 'src/shared/repositories/user-socket.repo'
import { TokenService } from 'src/shared/services/token.service'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'

export class CustomWebsocketAdapter extends IoAdapter {
  private readonly sharedUserSocketRepository: SharedUserSocketRepository
  private readonly tokenService: TokenService
  private adapterConstructor: ReturnType<typeof createAdapter>

  constructor(app: INestApplicationContext) {
    super()
    this.sharedUserSocketRepository = app.get(SharedUserSocketRepository)
    this.tokenService = app.get(TokenService)
  }

  async initRedisAdapter() {
    // Tạo Redis client (pub/sub)
    const pubClient = createClient({ socket: { host: envConfig.REDIS_HOST, port: envConfig.REDIS_PORT } })
    const subClient = pubClient.duplicate()

    // Kết nối song song cả 2 client
    await Promise.all([pubClient.connect(), subClient.connect()])

    // Tạo adapter constructor dùng cho socket.io
    this.adapterConstructor = createAdapter(pubClient, subClient)
  }

  createIOServer(port: number, options?: ServerOptions) {
    const websocketPort: number = envConfig.WEBSOCKET_PORT ?? 3001

    const server: Server = super.createIOServer(websocketPort, {
      ...options,
      cors: {
        origin: '*',
        credentials: true,
      },
    })

    // Apply `authMiddleware` for default namespace (`/`)
    server.use((socket, next) => {
      this.authMiddleware(socket, next)
        .then(() => {})
        .catch(() => {})
    })

    // Apply `authMiddleware` for other namespaces
    server.of(/.*/).use((socket, next) => {
      this.authMiddleware(socket, next)
        .then(() => {})
        .catch(() => {})
    })

    return server
  }

  async authMiddleware(socket: Socket, next: (error?: any) => void) {
    // console.log('>>> Info: ', socket.handshake)
    console.log(`>>> Client connected: ${socket.id}`)

    // Kiểm tra access token
    const { authorization } = socket.handshake.headers
    if (!authorization) return next(new Error('Unauthorized: Missing authorization field in header'))

    const accessToken = authorization.split(' ')[1]
    if (!accessToken) return next(new Error('Unauthorized: Missing access token in authorization'))

    try {
      const { userId } = await this.tokenService.verifyAccessToken(accessToken)

      if (USE_SOCKET_ROOM) {
        // Join socket room
        const userRoom = generateSocketRoomName(userId)
        await socket.join(userRoom)

        // Khi client disconnect --> rời room
      } else {
        await this.sharedUserSocketRepository.create({ socketId: socket.id, userId })

        socket.on('disconnect', async () => {
          console.log(`>>> Client disconnected: ${socket.id}`)

          await this.sharedUserSocketRepository.delete(socket.id).catch(() => {})
        })
      }

      // Cho phép xử lý tiếp
      next()
    } catch (error) {
      next(error)
    }
  }
}
