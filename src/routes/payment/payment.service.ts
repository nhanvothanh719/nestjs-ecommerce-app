import { Injectable } from '@nestjs/common'
import { WebhookPaymentRequestBodyType } from 'src/routes/payment/payment.model'
import { PaymentProducer } from 'src/routes/payment/payment.producer'
import { PaymentRepository } from 'src/routes/payment/payment.repo'
import { ResponseMessageType } from 'src/shared/models/response.model'

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentProducer: PaymentProducer,
  ) {}

  async receiver(body: WebhookPaymentRequestBodyType): Promise<ResponseMessageType> {
    const { paymentId, message } = await this.paymentRepository.receiver(body)
    await this.paymentProducer.removeCancelPaymentJob(paymentId)
    return { message }
  }
}
