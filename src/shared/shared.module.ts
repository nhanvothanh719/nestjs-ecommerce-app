import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import { SharedUserRepository } from 'src/shared/repositories/user.repo'
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
]

@Global()
@Module({
  providers: [
    ...SHARED_SERVICES,
    AccessTokenGuard,
    ApiKeyGuard,
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
