import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { RoleService } from './role.service'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import { GoogleAuthService } from 'src/routes/auth/google-auth.service'

@Module({
  providers: [AuthService, RoleService, AuthRepository, GoogleAuthService],
  controllers: [AuthController],
})
export class AuthModule {}
