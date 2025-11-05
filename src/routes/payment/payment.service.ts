import { Injectable } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { WebhookPaymentRequestBodyType } from 'src/routes/payment/payment.model'
import { PaymentRepository } from 'src/routes/payment/payment.repo'
import { ResponseMessageType } from 'src/shared/models/response.model'
import { SharedUserSocketRepository } from 'src/shared/repositories/user-socket.repo'
import { Server } from 'socket.io'
import { SUCCESS_PAYMENT_EVENT, USE_SOCKET_ROOM } from 'src/shared/constants/others.constants'
import { generateSocketRoomName } from 'src/shared/helpers'

@Injectable()
@WebSocketGateway({ namespace: 'payment' })
export class PaymentService {
  @WebSocketServer()
  webSocketServer: Server

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly sharedUserSocketRepository: SharedUserSocketRepository,
  ) {}

  async receiver(body: WebhookPaymentRequestBodyType): Promise<ResponseMessageType> {
    const { userId } = await this.paymentRepository.receiver(body)
    const successMessage = {
      message: 'Pay for orders successfully!!!',
    }

    if (USE_SOCKET_ROOM) {
      try {
        // Phát sự kiện ra socket room của user
        const userRoom = generateSocketRoomName(userId)
        this.webSocketServer.to(userRoom).emit(SUCCESS_PAYMENT_EVENT, successMessage)
      } catch (error) {
        console.error('>>> Failed to emit payment event to room:', error)
      }
    } else {
      try {
        const userWebsockets = await this.sharedUserSocketRepository.findByUserId(userId)
        userWebsockets.forEach((item) => {
          // Emit event ở namespace `/payment`
          this.webSocketServer.to(item.id).emit(SUCCESS_PAYMENT_EVENT, successMessage)
        })
      } catch (error) {
        console.error('>>> Failed to emit payment event to user sockets:', error)
      }
    }

    return { message: 'Successful payment' }
  }
}
