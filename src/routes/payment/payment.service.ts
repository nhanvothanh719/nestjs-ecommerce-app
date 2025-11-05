import { Injectable } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { WebhookPaymentRequestBodyType } from 'src/routes/payment/payment.model'
import { PaymentRepository } from 'src/routes/payment/payment.repo'
import { ResponseMessageType } from 'src/shared/models/response.model'
import { SharedUserSocketRepository } from 'src/shared/repositories/user-socket.repo'
import { Server } from 'socket.io'

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

    try {
      const userWebsockets = await this.sharedUserSocketRepository.findByUserId(userId)
      userWebsockets.forEach((item) => {
        // Emit event ở namespace `/payment`
        this.webSocketServer.to(item.id).emit('successful-payment', {
          message: 'Pay for orders successfully',
        })
      })
    } catch (error) {
      console.error('>>> Fail to emit successful-payment event: ', error)
    }

    return { message: 'Successful payment' }
  }
}
