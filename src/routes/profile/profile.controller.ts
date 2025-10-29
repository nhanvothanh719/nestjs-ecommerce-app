import { Body, Controller, Get, Put } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { ChangePasswordRequestBodyDTO, UpdateMyProfileRequestBodyDTO } from 'src/routes/profile/profile.dto'
import { ProfileService } from 'src/routes/profile/profile.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { ResponseMessageDTO } from 'src/shared/dtos/response.dto'
import { GetUserProfileResponseDTO, UpdateUserProfileResponseDTO } from 'src/shared/dtos/user.dto'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ZodResponse({ type: GetUserProfileResponseDTO })
  getCurrentUserProfile(@ActiveUser('userId') userId: number) {
    return this.profileService.getUserProfile(userId)
  }

  @Put()
  @ZodResponse({ type: UpdateUserProfileResponseDTO })
  updateCurrentUserProfile(@Body() body: UpdateMyProfileRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return this.profileService.updateUserProfile({ id: userId, data: body })
  }

  @Put('change-password')
  @ZodResponse({ type: ResponseMessageDTO })
  changePassword(@Body() body: ChangePasswordRequestBodyDTO, @ActiveUser('userId') userId: number) {
    return this.profileService.changePassword({ id: userId, data: body })
  }
}
