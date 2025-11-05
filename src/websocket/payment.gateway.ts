import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

const PAYMENT_NAMESPACE_PORT = 3004

// MEMO: namespace acts as route: `http://localhost:3004/payment`
@WebSocketGateway(PAYMENT_NAMESPACE_PORT, { namespace: 'payment' })
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
