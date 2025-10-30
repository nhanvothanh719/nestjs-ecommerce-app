import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import { GoogleAuthService } from 'src/routes/auth/google-auth.service'

@Module({
  providers: [AuthService, AuthRepository, GoogleAuthService],
  controllers: [AuthController],
})
export class AuthModule {}
