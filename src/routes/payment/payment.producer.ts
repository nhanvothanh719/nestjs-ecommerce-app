import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { PAYMENT_QUEUE } from 'src/shared/constants/queue.constant'
import { generateCancelPaymentJobId } from 'src/shared/helpers'

@Injectable()
export class PaymentProducer {
  constructor(@InjectQueue(PAYMENT_QUEUE) private paymentQueue: Queue) {
    // Enable this to view added job:
    // this.paymentQueue.getJobs().then((jobs) => console.log(jobs))
  }

  removeCancelPaymentJob(paymentId: number) {
    return this.paymentQueue.remove(generateCancelPaymentJobId(paymentId))
  }
}
