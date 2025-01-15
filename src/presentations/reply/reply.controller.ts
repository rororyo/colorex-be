import { Body, Controller, Inject, Param, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { CurrUserUsecase } from "src/applications/use-cases/user/currUser.usecase";
import { UseCaseProxy } from "src/infrastructure/usecase-proxy/usecase-proxy";
import { UseCaseProxyModule } from "src/infrastructure/usecase-proxy/usecase-proxy.module";
import { PostReplyDto, PostReplyParamsDto } from "./dto/postReply.dto";
import { getAuthCookie } from "src/utils/auth/get-auth-cookie";
import { postReplyUseCase } from "src/applications/use-cases/reply/postReply.usecase";

@Controller('api')
export class ReplyController {
  constructor(
    @Inject (UseCaseProxyModule.CURRENT_USER_USECASE) private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject (UseCaseProxyModule.POST_REPLY_USECASE) private readonly postReplyUseCaseProxy: UseCaseProxy<postReplyUseCase>,
  ){}
  @Post('/post/:postId/comment/:commentId/reply')
  async postReply(
    @Req() req: Request,
    @Param() params: PostReplyParamsDto,
    @Body() replyDto: PostReplyDto
  ){
    const { postId, commentId } = params;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    await this.postReplyUseCaseProxy.getInstance().execute(replyDto, user.id, postId, commentId);
    return {
      status: 'success',
      message: 'Reply created successfully',
    }
  }
}