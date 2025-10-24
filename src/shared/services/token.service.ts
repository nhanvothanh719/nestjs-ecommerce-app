import { Injectable } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import envConfig from 'src/shared/config'
import ms from 'ms'
import { AccessTokenPayloadCreate, RefreshTokenPayload, RefreshTokenPayloadCreate } from 'src/shared/types/jwt.type'
import { v4 as uuidv4 } from 'uuid'

const JWT_ALGORITHM = 'HS256'

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(payload: AccessTokenPayloadCreate) {
    const jwtSignOptions: JwtSignOptions = {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN as ms.StringValue,
      algorithm: JWT_ALGORITHM,
    }
    return this.jwtService.signAsync({ ...payload, uuid: uuidv4() }, jwtSignOptions)
  }

  signRefreshToken(payload: RefreshTokenPayloadCreate) {
    const jwtSignOptions: JwtSignOptions = {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue,
      algorithm: JWT_ALGORITHM,
    }
    return this.jwtService.signAsync({ ...payload, uuid: uuidv4() }, jwtSignOptions)
  }

  verifyAccessToken(token: string): Promise<AccessTokenPayloadCreate> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
    })
  }

  verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
    })
  }
}
