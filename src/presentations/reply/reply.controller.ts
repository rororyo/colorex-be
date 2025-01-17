import { Body, Controller, Delete, Inject, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { CurrUserUsecase } from "src/applications/use-cases/user/currUser.usecase";
import { UseCaseProxy } from "src/infrastructure/usecase-proxy/usecase-proxy";
import { UseCaseProxyModule } from "src/infrastructure/usecase-proxy/usecase-proxy.module";
import { PostReplyDto, PostReplyParamsDto } from "./dto/postReply.dto";
import { getAuthCookie } from "src/utils/auth/get-auth-cookie";
import { postReplyUseCase } from "src/applications/use-cases/reply/postReply.usecase";
import { DeleteReplyUsecase } from "src/applications/use-cases/reply/deleteReply.usecase";
import { JwtAuthGuard } from "src/infrastructure/auth/guards/jwt-auth.guard";
import { DeleteReplyParamsDto } from "./dto/deleteReply.dto";
import { EditReplyDto, EditReplyParamsDto } from "./dto/editReply.dto";
import { EditReplyUsecase } from "src/applications/use-cases/reply/editReply.usecase";

@Controller('api')
export class ReplyController {
  constructor(
    @Inject (UseCaseProxyModule.CURRENT_USER_USECASE) private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject (UseCaseProxyModule.POST_REPLY_USECASE) private readonly postReplyUseCaseProxy: UseCaseProxy<postReplyUseCase>,
    @Inject(UseCaseProxyModule.EDIT_REPLY_USECASE) private readonly editReplyUseCaseProxy: UseCaseProxy<EditReplyUsecase>,
    @Inject(UseCaseProxyModule.DELETE_REPLY_USECASE) private readonly deleteReplyUseCaseProxy: UseCaseProxy<DeleteReplyUsecase>,
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
  @UseGuards(JwtAuthGuard)
  @Put('reply/:replyId')
  async editReply(@Req() req: Request, @Param() params: EditReplyParamsDto, @Body() replyDto: EditReplyDto){
    const {replyId} = params;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    await this.editReplyUseCaseProxy.getInstance().execute(user.id, replyId, replyDto.content);
    return {
      status: 'success',
      message: 'Reply updated successfully',
    }
  }
  @UseGuards(JwtAuthGuard)
  @Delete('reply/:replyId')
  async deleteReply(@Req() req: Request, @Param() params: DeleteReplyParamsDto){
    const {replyId} = params;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    await this.deleteReplyUseCaseProxy.getInstance().execute(user.id, replyId);
    return {
      status: 'success',
      message: 'Reply deleted successfully',
    }
  }
}