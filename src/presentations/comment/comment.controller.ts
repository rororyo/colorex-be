import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostCommentUsecase } from 'src/applications/use-cases/comment/postComment.usecase';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import { UseCaseProxyModule } from 'src/infrastructure/usecase-proxy/usecase-proxy.module';
import { PostCommentDto, PostCommentParamsDto } from './dto/postComment.dto';
import { Request } from 'express';
import { getAuthCookie } from 'src/utils/auth/get-auth-cookie';
import { CurrUserUsecase } from 'src/applications/use-cases/user/currUser.usecase';

@Controller('api')
export class CommentController {
  constructor(
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE)
    private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.POST_COMMENT_USECASE)
    private readonly postCommentUseCaseProxy: UseCaseProxy<PostCommentUsecase>,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post('post/:postId/comments')
  async postComment(
    @Req() req: Request,
    @Body() commentDto: PostCommentDto,
    @Param() params: PostCommentParamsDto,
  ) {
    const postId = params.postId;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    await this.postCommentUseCaseProxy
      .getInstance()
      .execute(commentDto, user.id,postId);
      return {
        status: 'success',
        message: 'Comment created successfully',
      }
  }
}
