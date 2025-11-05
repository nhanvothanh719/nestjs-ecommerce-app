import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

// MEMO: namespace acts as route: `/payment`
@WebSocketGateway({ namespace: 'payment' })
export class PaymentGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('send-money')
  handleEvent(@MessageBody() data: string): string {
    // Emit event
    this.server.emit('receive-money', { message: `>>> From payment namespace: ${data}` })

    return data
  }
}
