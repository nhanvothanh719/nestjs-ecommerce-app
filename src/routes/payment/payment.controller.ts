import { Body, Controller, Post } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { WebhookPaymentRequestBodyDTO } from 'src/routes/payment/payment.dto'
import { PaymentService } from 'src/routes/payment/payment.service'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/receiver')
  @Auth(['PaymentAPIKey'])
  @ZodResponse({ type: ResponseMessageDTO })
  receiver(@Body() body: WebhookPaymentRequestBodyDTO) {
    return this.paymentService.receiver(body)
  }
}
