import { createZodDto } from 'nestjs-zod'
import { PaymentTransactionSchema, WebhookPaymentRequestBodySchema } from 'src/routes/payment/payment.model'

export class PaymentTransactionDTO extends createZodDto(PaymentTransactionSchema) {}
export class WebhookPaymentRequestBodyDTO extends createZodDto(WebhookPaymentRequestBodySchema) {}
