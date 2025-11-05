import { INestApplicationContext } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { Server, ServerOptions, Socket } from 'socket.io'
import { SharedUserSocketRepository } from 'src/shared/repositories/user-socket.repo'
import { TokenService } from 'src/shared/services/token.service'

export class CustomWebsocketAdapter extends IoAdapter {
  private readonly sharedUserSocketRepository: SharedUserSocketRepository
  private readonly tokenService: TokenService

  constructor(app: INestApplicationContext) {
    super()
    this.sharedUserSocketRepository = app.get(SharedUserSocketRepository)
    this.tokenService = app.get(TokenService)
  }

  createIOServer(port: number, options?: ServerOptions) {
    const RUN_PORT = 3003

    const server: Server = super.createIOServer(RUN_PORT, {
      ...options,
      cors: {
        origin: '*',
        credentials: true,
      },
    })

    // Apply `authMiddleware` for default namespace (`/`)
    server.use((socket, next) => {
      this.authMiddleware(socket, next)
    })

    // Apply `authMiddleware` for other namespaces
    server.of(/.*/).use((socket, next) => {
      this.authMiddleware(socket, next)
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
      await this.sharedUserSocketRepository.create({ socketId: socket.id, userId })

      socket.on('disconnect', async () => {
        console.log(`>>> Client disconnected: ${socket.id}`)

        await this.sharedUserSocketRepository.delete(socket.id).catch(() => {})
      })

      // Cho phép xử lý tiếp
      next()
    } catch (error) {
      next(error)
    }
  }
}
