import { Injectable } from '@nestjs/common'
import { WebhookPaymentRequestBodyType } from 'src/routes/payment/payment.model'
import { PaymentRepository } from 'src/routes/payment/payment.repo'
import { ResponseMessageType } from 'src/shared/models/response.model'

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  receiver(body: WebhookPaymentRequestBodyType): Promise<ResponseMessageType> {
    return this.paymentRepository.receiver(body)
  }
}
