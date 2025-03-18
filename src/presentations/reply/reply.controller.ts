import { Body, Controller, Delete, Inject, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CurrUserUsecase } from "../../applications/use-cases/user/currUser.usecase";
import { UseCaseProxy } from "../../infrastructure/usecase-proxy/usecase-proxy";
import { UseCaseProxyModule } from "../../infrastructure/usecase-proxy/usecase-proxy.module";
import { PostReplyDto, PostReplyParamsDto } from "./dto/postReply.dto";
import { getAuthCookie } from "../../utils/auth/get-auth-cookie";
import { postReplyUseCase } from "../../applications/use-cases/reply/postReply.usecase";
import { DeleteReplyUsecase } from "../../applications/use-cases/reply/deleteReply.usecase";
import { JwtAuthGuard } from "../../infrastructure/auth/guards/jwt-auth.guard";
import { DeleteReplyParamsDto } from "./dto/deleteReply.dto";
import { EditReplyDto, EditReplyParamsDto } from "./dto/editReply.dto";
import { EditReplyUsecase } from "../../applications/use-cases/reply/editReply.usecase";

@ApiTags('reply')
@Controller('api')
export class ReplyController {
  constructor(
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE) 
    private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.POST_REPLY_USECASE) 
    private readonly postReplyUseCaseProxy: UseCaseProxy<postReplyUseCase>,
    @Inject(UseCaseProxyModule.EDIT_REPLY_USECASE) 
    private readonly editReplyUseCaseProxy: UseCaseProxy<EditReplyUsecase>,
    @Inject(UseCaseProxyModule.DELETE_REPLY_USECASE) 
    private readonly deleteReplyUseCaseProxy: UseCaseProxy<DeleteReplyUsecase>,
  ){}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a reply to a comment' })
  @ApiParam({
    name: 'postId',
    required: true,
    description: 'ID of the post containing the comment',
  })
  @ApiParam({
    name: 'commentId',
    required: true,
    description: 'ID of the comment to reply to',
  })
  @ApiBody({
    type: PostReplyDto,
    description: 'Reply content',
  })
  @ApiResponse({
    status: 201,
    description: 'Reply created successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Reply created successfully',
      },
    },
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edit a reply' })
  @ApiParam({
    name: 'replyId',
    required: true,
    description: 'ID of the reply to edit',
  })
  @ApiBody({
    type: EditReplyDto,
    description: 'Updated reply content',
  })
  @ApiResponse({
    status: 200,
    description: 'Reply updated successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Reply updated successfully',
      },
    },
  })
  @Put('reply/:replyId')
  async editReply(
    @Req() req: Request, 
    @Param() params: EditReplyParamsDto, 
    @Body() replyDto: EditReplyDto
  ){
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a reply' })
  @ApiParam({
    name: 'replyId',
    required: true,
    description: 'ID of the reply to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Reply deleted successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Reply deleted successfully',
      },
    },
  })
  @Delete('reply/:replyId')
  async deleteReply(
    @Req() req: Request, 
    @Param() params: DeleteReplyParamsDto
  ){
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