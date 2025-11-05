import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('send-message')
  handleEvent(@MessageBody() data: string): string {
    console.log('>>> Receive Data: ', data)

    // Emit event
    this.server.emit('receive-message', { message: 'OK' })

    return data
  }
}
