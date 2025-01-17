import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Post,
  Put,
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
import { DeleteCommentParamsDto } from './dto/deleteComment.dto';
import { DeleteCommentUsecase } from 'src/applications/use-cases/comment/deleteComment.usecase';
import { EditCommentDto, EditCommentParamsDto } from './dto/editComment.dto';
import { EditCommentUsecase } from 'src/applications/use-cases/comment/editComment.usecase';

@Controller('api')
export class CommentController {
  constructor(
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE)
    private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.POST_COMMENT_USECASE)
    private readonly postCommentUseCaseProxy: UseCaseProxy<PostCommentUsecase>,
    @Inject(UseCaseProxyModule.EDIT_COMMENT_USECASE) private readonly editCommentUseCaseProxy: UseCaseProxy<EditCommentUsecase>,
    @Inject(UseCaseProxyModule.DELETE_COMMENT_USECASE) private readonly deleteCommentUseCaseProxy: UseCaseProxy<DeleteCommentUsecase>,
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
  @UseGuards(JwtAuthGuard)
  @Put('comment/:commentId')
  async updateComment(@Req() req: Request, @Param() editCommentParamsDto: EditCommentParamsDto,@Body() commentDto: EditCommentDto) {
    const commentId = editCommentParamsDto.commentId;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    await this.editCommentUseCaseProxy.getInstance().execute(user.id, commentId, commentDto.content);
    return {
      status: 'success',
      message: 'Comment updated successfully',
    };
  }
  @UseGuards(JwtAuthGuard)
  @Delete('comment/:commentId')
  async deleteComment(@Req() req: Request, @Param() params: DeleteCommentParamsDto) {
    const commentId = params.commentId;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    await this.deleteCommentUseCaseProxy.getInstance().execute(commentId, user.id);
    return {
      status: 'success',
      message: 'Comment deleted successfully',
    };
  }
}
