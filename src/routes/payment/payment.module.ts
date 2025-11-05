import { Module } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'
import { PaymentRepository } from './payment.repo'
import { PaymentProducer } from './payment.producer'
import { BullModule } from '@nestjs/bullmq'
import { PAYMENT_QUEUE } from 'src/shared/constants/queue.constant'

@Module({
  imports: [
    BullModule.registerQueue({
      name: PAYMENT_QUEUE,
    }),
  ],
  providers: [PaymentService, PaymentRepository, PaymentProducer],
  controllers: [PaymentController],
})
export class PaymentModule {}
