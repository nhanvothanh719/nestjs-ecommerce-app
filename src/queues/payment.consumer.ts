import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { CANCEL_PAYMENT_JOB, PAYMENT_QUEUE } from 'src/shared/constants/queue.constant'
import { SharedPaymentRepository } from 'src/shared/repositories/payment.repo'

@Processor(PAYMENT_QUEUE)
export class PaymentConsumer extends WorkerHost {
  constructor(private readonly sharedPaymentRepository: SharedPaymentRepository) {
    super()
  }

  async process(job: Job<{ paymentId: number }, any, string>): Promise<any> {
    switch (job.name) {
      case CANCEL_PAYMENT_JOB: {
        const { paymentId } = job.data
        await this.sharedPaymentRepository.cancelOrderPayment(paymentId)
        return {}
      }
      default: {
        break
      }
    }
  }
}
