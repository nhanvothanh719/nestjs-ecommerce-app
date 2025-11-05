import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

const CHAT_NAMESPACE_PORT = 3003
// MEMO: namespace acts as route: `http://localhost:3003/chat`
@WebSocketGateway(CHAT_NAMESPACE_PORT, { namespace: 'chat' })
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
