import { IoAdapter } from '@nestjs/platform-socket.io'
import { Server, ServerOptions } from 'socket.io'

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
    return server
  }
}
