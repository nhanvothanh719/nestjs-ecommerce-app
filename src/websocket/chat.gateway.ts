import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

// MEMO: namespace acts as route: `/chat`
@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('send-message')
  handleEvent(@MessageBody() data: string): string {
    // Emit event
    this.server.emit('receive-message', { message: `>>> From chat namespace: ${data}` })

    return data
  }
}
