import { IoAdapter } from '@nestjs/platform-socket.io'
import { Server, ServerOptions, Socket } from 'socket.io'

const namespaces = ['/', 'payment', 'chat']

export class CustomWebsocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions) {
    const RUN_PORT = 3003

    const server: Server = super.createIOServer(RUN_PORT, {
      ...options,
      cors: {
        origin: '*',
        credentials: true,
      },
    })

    const authMiddleware = (socket: Socket, next: (error?: any) => void) => {
      console.log(`>>> Client connected: ${socket.id}`)

      socket.on('disconnect', () => {
        console.log(`>>> Client disconnected: ${socket.id}`)
      })

      next()
    }

    namespaces.forEach((namespace) => {
      server.of(namespace).use(authMiddleware)
    })

    return server
  }
}
