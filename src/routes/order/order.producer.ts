import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { delay, JobsOptions, Queue } from 'bullmq'
import { CANCEL_PAYMENT_JOB, PAYMENT_QUEUE } from 'src/shared/constants/queue.constant'
import { generateCancelPaymentJobId } from 'src/shared/helpers'

@Injectable()
export class OrderProducer {
  constructor(@InjectQueue(PAYMENT_QUEUE) private paymentQueue: Queue) {
    // Enable this to view added job:
    // this.paymentQueue.getJobs().then((jobs) => console.log(jobs))
  }

  async addCancelPaymentJob(paymentId: number) {
    const data = { paymentId }
    const options: JobsOptions = {
      delay: 1000 * 60 * 60 * 24, // Run after being called 24 hours
      jobId: generateCancelPaymentJobId(paymentId),
      // Xóa job khỏi hàng đợi sau khi đã thực thi xong hoặc bị lỗi
      removeOnComplete: true,
      removeOnFail: true,
    }
    return this.paymentQueue.add(CANCEL_PAYMENT_JOB, data, options)
  }
}
