import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import { PaymentApiKeyGuard } from 'src/shared/guards/payment-api-key.guard'
import { SharedPaymentRepository } from 'src/shared/repositories/payment.repo'
import { SharedRoleRepository } from 'src/shared/repositories/role.repo'
import { SharedUserRepository } from 'src/shared/repositories/user.repo'
import { AwsS3Service } from 'src/shared/services/aws_s3.service'
import { EmailService } from 'src/shared/services/email.service'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'
import { TwoFactorAuthenticationService } from 'src/shared/services/two-factor-auth.service'

const SHARED_SERVICES = [
  PrismaService,
  HashingService,
  TokenService,
  SharedUserRepository,
  EmailService,
  TwoFactorAuthenticationService,
  SharedRoleRepository,
  AwsS3Service,
  SharedPaymentRepository,
]

@Global()
@Module({
  providers: [
    ...SHARED_SERVICES,
    AccessTokenGuard,
    PaymentApiKeyGuard,
    // Set AuthenticationGuard as global guard
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  exports: SHARED_SERVICES,
  imports: [JwtModule],
})
export class SharedModule {}
