import { Module } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'
import { PaymentRepository } from './payment.repo'

@Module({
  providers: [PaymentService, PaymentRepository],
  controllers: [PaymentController],
})
export class PaymentModule {}
