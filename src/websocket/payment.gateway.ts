import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

// MEMO: namespace acts as route: `/payment`
@WebSocketGateway({ namespace: 'payment' })
// export class PaymentGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
export class PaymentGateway {
  @WebSocketServer()
  server: Server

  // afterInit(server: Server) {
  //   console.log('>>> Websocket server initialized')
  // }

  // handleConnection(client: Socket, ...args: any[]) {
  //   console.log('>>> Client connected: ', client.id)
  // }

  // handleDisconnect(client: Socket) {
  //   console.log('>>> Client disconnected: ', client.id)
  // }

  @SubscribeMessage('send-money')
  handleEvent(@MessageBody() data: string): string {
    // Emit event
    this.server.emit('receive-money', { message: `>>> From payment namespace: ${data}` })

    return data
  }
}
