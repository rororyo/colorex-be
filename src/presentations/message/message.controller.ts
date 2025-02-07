import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { CreateMessageUsecase } from 'src/applications/use-cases/message/createMessage.usecase';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import { UseCaseProxyModule } from 'src/infrastructure/usecase-proxy/usecase-proxy.module';
import { PostMessageDto } from './dto/postMessage.dto';
import { CurrUserUsecase } from 'src/applications/use-cases/user/currUser.usecase';
import { Request } from 'express';
import { getAuthCookie } from 'src/utils/auth/get-auth-cookie';

@Controller('api/message')
export class MessageController {
  constructor(
    @Inject(UseCaseProxyModule.POST_MESSAGE_USECASE)
    private readonly postMessageUseCaseProxy: UseCaseProxy<CreateMessageUsecase>,
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE) private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async createMessage(@Body() postMessageDto: PostMessageDto,@Req() req:Request) {
    const { receiverId, content } = postMessageDto;
    const token = getAuthCookie(req);
    const { id: senderId } = await this.currUserUseCaseProxy.getInstance().execute(token);
    await this.postMessageUseCaseProxy
      .getInstance()
      .execute(senderId, receiverId, content);
    return{
      status: 'success',
      message: 'Message sent successfully',
    }
  }
}
