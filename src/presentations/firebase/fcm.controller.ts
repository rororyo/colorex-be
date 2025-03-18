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

@Controller('api/fcm')
export class FcmController {
  constructor(
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE)
    private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.SEND_NOTIFICATION_USECASE)
    private readonly sendNotificationUseCaseProxy: UseCaseProxy<PushNotificationUsecase>,
    @Inject(UseCaseProxyModule.EDIT_FCM_TOKEN_USECASE) private readonly editFCMTokenUseCaseProxy: UseCaseProxy<EditFCMTokenUsecase>,
    
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post('notification')
  async sendNotification(@Body() payload: CreateNotificationDto) {
    await this.sendNotificationUseCaseProxy.getInstance().execute(payload);
    return {
      status: 'success',
      message: 'Notification sent successfully',
    };
  }
  @UseGuards(JwtAuthGuard)
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
