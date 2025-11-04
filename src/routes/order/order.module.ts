import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { OrderRepository } from './order.repo'
import { BullModule } from '@nestjs/bullmq'
import { PAYMENT_QUEUE } from 'src/shared/constants/queue.constant'
import { OrderProducer } from 'src/routes/order/order.producer'

@Module({
  imports: [
    BullModule.registerQueue({
      name: PAYMENT_QUEUE,
    }),
  ],
  providers: [OrderService, OrderRepository, OrderProducer],
  controllers: [OrderController],
})
export class OrderModule {}
