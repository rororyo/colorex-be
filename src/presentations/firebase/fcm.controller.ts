import { Controller, Post, Body, Inject, UseGuards, Req } from '@nestjs/common';
import { PushNotificationUsecase } from '../../applications/use-cases/firebase/pushNotification.usecase';
import { UseCaseProxyModule } from '../../infrastructure/usecase-proxy/usecase-proxy.module';

import { UseCaseProxy } from '../../infrastructure/usecase-proxy/usecase-proxy';
import { CreateNotificationDto } from './dto/createNotification.dto';
import {
  UpdateFCMTokenDto,
} from './dto/updateFCMToken.dto';
import { CurrUserUsecase } from '../../applications/use-cases/user/currUser.usecase';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { getAuthCookie } from '../../utils/auth/get-auth-cookie';
import { EditFCMTokenUsecase } from '../../applications/use-cases/firebase/saveFcmToken.usecase';

@ApiTags('FCM') // Adds a category in Swagger
@Controller('api/fcm')
export class FcmController {
  constructor(
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE)
    private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.SEND_NOTIFICATION_USECASE)
    private readonly sendNotificationUseCaseProxy: UseCaseProxy<PushNotificationUsecase>,
    @Inject(UseCaseProxyModule.EDIT_FCM_TOKEN_USECASE)
    private readonly editFCMTokenUseCaseProxy: UseCaseProxy<EditFCMTokenUsecase>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send push notification via FCM' })
  @ApiBody({
    description: 'Notification details',
    type: CreateNotificationDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Notification sent successfully.',
    schema: {
      example: {
        status: 'success',
        message: 'Notification sent successfully',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token is missing or invalid.' })
  @Post('notification')
  async sendNotification(@Body() payload: CreateNotificationDto) {
    await this.sendNotificationUseCaseProxy.getInstance().execute(payload);
    return {
      status: 'success',
      message: 'Notification sent successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Requires JWT authentication
  @ApiOperation({ summary: 'Update FCM token for user' })
  @ApiBody({
    description: 'FCM token update details',
    type: UpdateFCMTokenDto,
  })
  @ApiResponse({
    status: 200,
    description: 'FCM token updated successfully.',
    schema: {
      example: {
        status: 'success',
        message: 'Token updated successfully',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token is missing or invalid.' })
  @Post('token')
  async updateFcmToken(
    @Req() req: Request,
    @Body() payload: UpdateFCMTokenDto,
  ) {
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    await this.editFCMTokenUseCaseProxy.getInstance().execute(user.id, payload);

    return {
      status: 'success',
      message: 'Token updated successfully',
    };
  }
}
