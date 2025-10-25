import { Injectable } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import { GoogleAuthStateType } from 'src/routes/auth/auth.model'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import { RoleService } from 'src/routes/auth/role.service'
import { v4 as uuidv4 } from 'uuid'
import envConfig from 'src/shared/config'
import { HashingService } from 'src/shared/services/hashing.service'
import { AuthService } from 'src/routes/auth/auth.service'

@Injectable()
export class GoogleAuthService {
  private oauth2Client: OAuth2Client

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly roleService: RoleService,
    private readonly hashingService: HashingService,
    private readonly authService: AuthService,
  ) {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = envConfig
    this.oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
  }

  getGoogleAuthorizationUrl({ userAgent, ip }: GoogleAuthStateType) {
    const scope = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']

    // Convert from Object to Base64 string for safely putting in URL (state=...)
    const stateString = Buffer.from(JSON.stringify({ userAgent, ip })).toString('base64')

    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope,
      include_granted_scopes: true,
      state: stateString,
    })

    return { url }
  }

  async handleGoogleCallback({ code, state }: { code: string; state: string }) {
    try {
      let userAgent = 'Unknown'
      let ip = 'Unknown'

      // Lấy state từ url
      try {
        if (state) {
          const clientInfo = JSON.parse(Buffer.from(state, 'base64').toString()) as GoogleAuthStateType
          userAgent = clientInfo.userAgent
          ip = clientInfo.ip
        }
      } catch (error) {
        console.error('Error parsing state: ', error)
      }

      // Dùng code để lấy token từ Google
      const { tokens } = await this.oauth2Client.getToken(code)
      this.oauth2Client.setCredentials(tokens)

      // Lấy user info from Google
      const oauth2 = google.oauth2({
        auth: this.oauth2Client,
        version: 'v2',
      })
      const { data } = await oauth2.userinfo.get()
      if (!data.email) throw new Error('Unable to get user info from Google')

      // Get user info from Google --> Create new user in case user is not found in the system
      let user = await this.authRepository.findUniqueUserWithRoleIncluded({ email: data.email })
      if (!user) {
        const clientRoleId = await this.roleService.getClientRoleId()
        const uuid = uuidv4()
        const password = await this.hashingService.hash(uuid)

        user = await this.authRepository.createUserWithRoleIncluded({
          email: data.email,
          name: data.email,
          password,
          roleId: clientRoleId,
          phoneNumber: '',
          avatar: data.picture ?? null,
        })
      }

      // Add device
      const device = await this.authRepository.createDevice({
        userId: user.id,
        userAgent,
        ip,
      })

      // Generate tokens
      const systemAuthTokens = await this.authService.generateAccessAndRefreshTokens({
        userId: user.id,
        deviceId: device.id,
        roleId: user.roleId,
        roleName: user.role.name,
      })

      return systemAuthTokens
    } catch (error) {
      console.error('Error in handling Google callback: ', error)
      throw new Error('Fail to login with Google')
    }
  }
}
