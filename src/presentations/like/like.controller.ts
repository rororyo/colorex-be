import { Controller, Inject, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { CommentLikeUsecase } from "src/applications/use-cases/like/commentLike.usecase";
import { PostLikeUsecase } from "src/applications/use-cases/like/postLike.usecase";
import { CurrUserUsecase } from "src/applications/use-cases/user/currUser.usecase";
import { JwtAuthGuard } from "src/infrastructure/auth/guards/jwt-auth.guard";
import { UseCaseProxy } from "src/infrastructure/usecase-proxy/usecase-proxy";
import { UseCaseProxyModule } from "src/infrastructure/usecase-proxy/usecase-proxy.module";
import { getAuthCookie } from "src/utils/auth/get-auth-cookie";
import { getCommentLikesParamsDto, getPostLikesParamsDto, getReplyLikesParamsDto } from "./dto/like.dto";
import { ReplyLikeUsecase } from "src/applications/use-cases/like/replyLike.usecasse";

@Controller('api')
export class LikeController {
  constructor(
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE) private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.POST_LIKE_USECASE) private readonly postLikeUseCaseProxy: UseCaseProxy<PostLikeUsecase>,
    @Inject(UseCaseProxyModule.COMMENT_LIKE_USECASE) private readonly commentLikeUseCaseProxy: UseCaseProxy<CommentLikeUsecase>,
    @Inject(UseCaseProxyModule.REPLY_LIKE_USECASE) private readonly replyLikeUseCaseProxy: UseCaseProxy<ReplyLikeUsecase>,
  ){}
  @UseGuards(JwtAuthGuard)
  @Post('post/:postId/like')
  async postLikeAction(@Req() req: Request, @Param() params: getPostLikesParamsDto) {
    const { postId } = params;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const likeMsg = await this.postLikeUseCaseProxy.getInstance().execute(postId, user.id);
    return {
      status: 'success',
      message: likeMsg,
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post('comment/:commentId/like')
  async commentLikeAction(@Req() req: Request, @Param() params: getCommentLikesParamsDto) {
    const { commentId } = params;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const likeMsg = await this.commentLikeUseCaseProxy.getInstance().execute(commentId, user.id);
    return {
      status: 'success',
      message: likeMsg,
    }
  }
  @UseGuards(JwtAuthGuard)
  @Post('reply/:replyId/like')
  async replyLikeAction(@Req() req: Request, @Param() params: getReplyLikesParamsDto) {
    const { replyId } = params;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const likeMsg = await this.replyLikeUseCaseProxy.getInstance().execute(replyId, user.id);
    return {
      status: 'success',
      message: likeMsg,
    }
  }
  
}