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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { PostCommentUsecase } from '../../applications/use-cases/comment/postComment.usecase';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { UseCaseProxy } from '../../infrastructure/usecase-proxy/usecase-proxy';
import { UseCaseProxyModule } from '../../infrastructure/usecase-proxy/usecase-proxy.module';
import { PostCommentDto, PostCommentParamsDto } from './dto/postComment.dto';
import { Request } from 'express';
import { getAuthCookie } from '../../utils/auth/get-auth-cookie';
import { CurrUserUsecase } from '../../applications/use-cases/user/currUser.usecase';
import { DeleteCommentParamsDto } from './dto/deleteComment.dto';
import { DeleteCommentUsecase } from '../../applications/use-cases/comment/deleteComment.usecase';
import { EditCommentDto, EditCommentParamsDto } from './dto/editComment.dto';
import { EditCommentUsecase } from '../../applications/use-cases/comment/editComment.usecase';

@ApiTags('comment')
@Controller('api')
export class CommentController {
  constructor(
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE)
    private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.POST_COMMENT_USECASE)
    private readonly postCommentUseCaseProxy: UseCaseProxy<PostCommentUsecase>,
    @Inject(UseCaseProxyModule.EDIT_COMMENT_USECASE)
    private readonly editCommentUseCaseProxy: UseCaseProxy<EditCommentUsecase>,
    @Inject(UseCaseProxyModule.DELETE_COMMENT_USECASE)
    private readonly deleteCommentUseCaseProxy: UseCaseProxy<DeleteCommentUsecase>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Post a comment on a post' })
  @ApiParam({ name: 'postId', required: true, description: 'ID of the post' })
  @ApiBody({ type: PostCommentDto })
  @ApiResponse({ status: 201, description: 'Comment created successfully' , schema: {
    example: {
      status: 'success',
      message: 'Comment created successfully',
    },
  }})
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
      .execute(commentDto, user.id, postId);
    return {
      status: 'success',
      message: 'Comment created successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({
    name: 'commentId',
    required: true,
    description: 'ID of the comment',
  })
  @ApiBody({ type: EditCommentDto })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Comment updated successfully',
      },
    },
  })
  @Put('comment/:commentId')
  async updateComment(
    @Req() req: Request,
    @Param() editCommentParamsDto: EditCommentParamsDto,
    @Body() commentDto: EditCommentDto,
  ) {
    const commentId = editCommentParamsDto.commentId;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    await this.editCommentUseCaseProxy
      .getInstance()
      .execute(user.id, commentId, commentDto.content);
    return {
      status: 'success',
      message: 'Comment updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({
    name: 'commentId',
    required: true,
    description: 'ID of the comment',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Comment deleted successfully',
      },
    },
  })
  @Delete('comment/:commentId')
  async deleteComment(
    @Req() req: Request,
    @Param() params: DeleteCommentParamsDto,
  ) {
    const commentId = params.commentId;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    await this.deleteCommentUseCaseProxy
      .getInstance()
      .execute(commentId, user.id);
    return {
      status: 'success',
      message: 'Comment deleted successfully',
    };
  }
}
