import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateMessageUsecase } from '../../applications/use-cases/message/createMessage.usecase';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { UseCaseProxy } from '../../infrastructure/usecase-proxy/usecase-proxy';
import { UseCaseProxyModule } from '../../infrastructure/usecase-proxy/usecase-proxy.module';
import { PostMessageDto, postMessageParamsDto } from './dto/postMessage.dto';
import { CurrUserUsecase } from '../../applications/use-cases/user/currUser.usecase';
import { Request } from 'express';
import { getAuthCookie } from '../../utils/auth/get-auth-cookie';
import { GetMessagesUsecase } from '../../applications/use-cases/message/getMessages.usecase';

@Controller('api/message')
export class MessageController {
  constructor(
    @Inject(UseCaseProxyModule.GET_MESSAGES_USECASE) private readonly getMessageUseCaseProxy: UseCaseProxy<GetMessagesUsecase>,
    @Inject(UseCaseProxyModule.POST_MESSAGE_USECASE)
    private readonly postMessageUseCaseProxy: UseCaseProxy<CreateMessageUsecase>,
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE) private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get messages between users' })
  @ApiParam({
    name: 'receiverId',
    required: true,
    description: 'The ID of the receiver to fetch messages for',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiResponse({
    status: 200,
    description: 'Messages fetched successfully.',
    schema: {
      example: {
        status: 'success',
        message: 'Messages fetched successfully',
        data: [
          {
              "id": "574541d5-cbd1-41ab-aabf-8e7ec15ed71e",
              "content": "test",
              "createdAt": "2025-02-07T16:18:25.111Z",
              "sender": {
                  "username": "adminers",
                  "role": "user",
                  "avatarUrl": null
              },
              "receiver": {
                  "username": "adminers",
                  "role": "user",
                  "avatarUrl": null
              }
          }
      ]
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token is missing or invalid.' })
  @ApiResponse({ status: 404, description: 'No messages found.' })
  @Get(':receiverId')
  async getMessages(@Param() params: postMessageParamsDto, @Req() req: Request) {
    const { receiverId } = params;
    const token = getAuthCookie(req);
    const { id: senderId } = await this.currUserUseCaseProxy.getInstance().execute(token);
    const messages = await this.getMessageUseCaseProxy.getInstance().execute(senderId, receiverId);
    return {
      status: 'success',
      message: 'Messages fetched successfully',
      data: messages,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a message to a user' })
  @ApiParam({
    name: 'receiverId',
    required: true,
    description: 'The ID of the receiver to send the message to',
    schema: { type: 'string', format: 'uuid' },
  })
  @ApiBody({
    description: 'Message content',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: 'Hello, how are you?' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Message sent successfully.',
    schema: {
      example: {
        status: 'success',
        message: 'Message sent successfully',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request. Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Token is missing or invalid.' })
  @ApiResponse({ status: 404, description: 'Receiver not found.' })
  @Post(':receiverId')
  async createMessage(@Body() postMessageDto: PostMessageDto, @Req() req: Request, @Param() params: postMessageParamsDto) {
    const { receiverId } = params;
    const { content } = postMessageDto;
    const token = getAuthCookie(req);
    const { id: senderId } = await this.currUserUseCaseProxy.getInstance().execute(token);
    await this.postMessageUseCaseProxy.getInstance().execute(senderId, receiverId, content);
    return {
      status: 'success',
      message: 'Message sent successfully',
    };
  }
}
