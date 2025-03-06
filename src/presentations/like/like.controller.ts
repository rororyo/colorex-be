import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CommentLikeUsecase } from 'src/applications/use-cases/like/commentLike.usecase';
import { PostLikeUsecase } from 'src/applications/use-cases/like/postLike.usecase';
import { CurrUserUsecase } from 'src/applications/use-cases/user/currUser.usecase';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import { UseCaseProxyModule } from 'src/infrastructure/usecase-proxy/usecase-proxy.module';
import { getAuthCookie } from 'src/utils/auth/get-auth-cookie';
import {
  getCommentLikesParamsDto,
  getPostLikesParamsDto,
  getReplyLikesParamsDto,
} from './dto/like.dto';
import { ReplyLikeUsecase } from 'src/applications/use-cases/like/replyLike.usecasse';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GetPostLikeStatusUseCase } from 'src/applications/use-cases/like/getPostLikeStatus.usecase';
import { GetCommentLikeStatusUsecase } from 'src/applications/use-cases/like/getCommentLikeStatus.usecase';
import { GetReplyLikeStatusUsecase } from 'src/applications/use-cases/like/getReplyLikeStatus.usecase';

@ApiTags('like')
@Controller('api')
export class LikeController {
  constructor(
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE)
    private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.POST_LIKE_USECASE)
    private readonly postLikeUseCaseProxy: UseCaseProxy<PostLikeUsecase>,
    @Inject(UseCaseProxyModule.COMMENT_LIKE_USECASE)
    private readonly commentLikeUseCaseProxy: UseCaseProxy<CommentLikeUsecase>,
    @Inject(UseCaseProxyModule.REPLY_LIKE_USECASE)
    private readonly replyLikeUseCaseProxy: UseCaseProxy<ReplyLikeUsecase>,
    @Inject(UseCaseProxyModule.GET_POST_LIKE_STATUS_USECASE)
    private readonly getPostLikeStatusUseCaseProxy: UseCaseProxy<GetPostLikeStatusUseCase>,
    @Inject(UseCaseProxyModule.GET_COMMENT_LIKE_STATUS_USECASE)
    private readonly getCommentLikeStatusUseCaseProxy: UseCaseProxy<GetCommentLikeStatusUsecase>,
    @Inject(UseCaseProxyModule.GET_REPLY_LIKE_STATUS_USECASE)
    private readonly getReplyLikeStatusUseCaseProxy: UseCaseProxy<GetReplyLikeStatusUsecase>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like a post' })
  @ApiParam({
    name: 'postId',
    required: true,
    description: 'ID of the post to like',
  })
  @ApiResponse({
    status: 201,
    description: 'Like or unlike a post',
    schema: {
      example: {
        status: 'success',
        message: 'Post Liked Successfully',
      },
    },
  })
  @Post('post/:postId/like')
  async postLikeAction(
    @Req() req: Request,
    @Param() params: getPostLikesParamsDto,
  ) {
    const { postId } = params;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const likeMsg = await this.postLikeUseCaseProxy
      .getInstance()
      .execute(postId, user.id);
    return {
      status: 'success',
      message: likeMsg,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/post/:postId/like/status')
  async getPostLikeStatus(@Param() params: getPostLikesParamsDto,@Req() req: Request) {
    const { postId } = params;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const isPostLiked =  await this.getPostLikeStatusUseCaseProxy.getInstance().execute(postId,user.id);
    return {
      status: 'success',
      message: 'Successfuly retrieved post like status',
      data: isPostLiked
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like a comment' })
  @ApiParam({
    name: 'commentId',
    required: true,
    description: 'ID of the comment to like',
  })
  @ApiResponse({
    status: 201,
    description: 'Like or unlike a comment',
    schema: {
      example: {
        status: 'success',
        message: 'Comment Liked Successfully',
      },
    },
  })
  @Post('comment/:commentId/like')
  async commentLikeAction(
    @Req() req: Request,
    @Param() params: getCommentLikesParamsDto,
  ) {
    const { commentId } = params;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const likeMsg = await this.commentLikeUseCaseProxy
      .getInstance()
      .execute(commentId, user.id);
    return {
      status: 'success',
      message: likeMsg,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/comment/:commentId/like/status')
  async getCommentLikeStatus(@Param() params: getCommentLikesParamsDto,@Req() req: Request) {
    const { commentId } = params;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const isCommentLiked =  await this.getCommentLikeStatusUseCaseProxy.getInstance().execute(commentId,user.id);
    return {
      status: 'success',
      message: 'Successfuly retrieved comment like status',
      data: isCommentLiked
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like a reply' })
  @ApiParam({
    name: 'replyId',
    required: true,
    description: 'ID of the reply to like',
  })
  @ApiResponse({
    status: 201,
    description: 'Like or unlike a reply',
    schema: {
      example: {
        status: 'success',
        message: 'Reply Liked Successfully',
      },
    },
  })
  @Post('reply/:replyId/like')
  async replyLikeAction(
    @Req() req: Request,
    @Param() params: getReplyLikesParamsDto,
  ) {
    const { replyId } = params;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const likeMsg = await this.replyLikeUseCaseProxy
      .getInstance()
      .execute(replyId, user.id);
    return {
      status: 'success',
      message: likeMsg,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('/reply/:replyId/like/status')
  async getReplyLikeStatus(@Param() params: getReplyLikesParamsDto,@Req() req: Request) {
    const { replyId } = params;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const isReplyLiked =  await this.getReplyLikeStatusUseCaseProxy.getInstance().execute(replyId,user.id);
    return {
      status: 'success',
      message: 'Successfuly retrieved reply like status',
      data: isReplyLiked
    };
  }
}
