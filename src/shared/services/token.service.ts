import { Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import envConfig from 'src/shared/config'
import ms from 'ms'
import { TokenPayload } from 'src/shared/types/jwt.type'

const JWT_ALGORITHM = 'HS256'

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(payload: { userId: number }) {
    const jwtSignOptions: JwtSignOptions = {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN as ms.StringValue,
      algorithm: JWT_ALGORITHM,
    }
    return this.jwtService.signAsync(payload, jwtSignOptions)
  }

  signRefreshToken(payload: { userId: number }) {
    const jwtSignOptions: JwtSignOptions = {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue,
      algorithm: JWT_ALGORITHM,
    }
    return this.jwtService.signAsync(payload, jwtSignOptions)
  }

  verifyAccessToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
    })
  }

  verifyRefreshToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
    })
  }
}
