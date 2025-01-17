import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { PostMediaUsecase } from 'src/applications/use-cases/posts/postMedia.usecase';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import { UseCaseProxyModule } from 'src/infrastructure/usecase-proxy/usecase-proxy.module';
import { PostMediaDto } from './dto/postMedia.dto';
import { CurrUserUsecase } from 'src/applications/use-cases/user/currUser.usecase';
import { getAuthCookie } from 'src/utils/auth/get-auth-cookie';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { convertToMediaFile } from 'src/utils/validator/file.validator';
import { GetMediaDetailsUsecase } from 'src/applications/use-cases/posts/getMedia.usecase';
import { MediaParamsDto } from './dto/MediaParams.dto';
import { GetPaginatedMediaUsecase } from 'src/applications/use-cases/posts/getPaginatedMedia.usecase';
import { DeleteMediaUsecase } from 'src/applications/use-cases/posts/deleteMedia.usecase';
import { EditMediaUsecase } from 'src/applications/use-cases/posts/editMedia.usecase';
import { EditMediaDto } from './dto/editMedia.dto';

@Controller('api')
export class PostMediaController {
  constructor(
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE)
    private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.GET_PAGINATED_MEDIA_USECASE)
    private readonly getPaginatedMediaUsecaseProxy: UseCaseProxy<GetPaginatedMediaUsecase>,
    @Inject(UseCaseProxyModule.GET_MEDIA_USECASE)
    private readonly getMediaUsecaseProxy: UseCaseProxy<GetMediaDetailsUsecase>,
    @Inject(UseCaseProxyModule.POST_MEDIA_USECASE)
    private readonly postMediaUsecaseProxy: UseCaseProxy<PostMediaUsecase>,
    @Inject(UseCaseProxyModule.EDIT_POST_USECASE)
    private readonly editPostUsecaseProxy: UseCaseProxy<EditMediaUsecase>,
    @Inject(UseCaseProxyModule.DELETE_POST_USECASE)
    private readonly deletePostUsecaseProxy: UseCaseProxy<DeleteMediaUsecase>,
  ) {}
  @Get('posts')
  async getPaginatedPosts(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const posts = await this.getPaginatedMediaUsecaseProxy
      .getInstance()
      .execute(page, limit);
    return {
      status: 'success',
      message: 'Posts fetched successfully',
      data: posts,
    };
  }
  @Get('post/:postId')
  async getMedia(@Param() params: MediaParamsDto) {
    const { postId } = params;
    const post = await this.getMediaUsecaseProxy.getInstance().execute(postId);
    return {
      status: 'success',
      message: 'Post details fetched successfully',
      data: post,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('post')
  @UseInterceptors(FileInterceptor('file'))
  async postMedia(
    @Req() req: Request,
    @Body() postMediaDto: PostMediaDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const mediaFile = convertToMediaFile(file);
    const completePost = {
      ...postMediaDto,
    };

    await this.postMediaUsecaseProxy
      .getInstance()
      .execute(completePost, user.id);
    return {
      status: 'success',
      message: 'Post created successfully',
    };
  }
  @UseGuards(JwtAuthGuard)
  @Put('post/:postId')
  async updatePost(
    @Req() req: Request,
    @Param() params: MediaParamsDto,
    @Body() editMediaDto: EditMediaDto,
  ) {
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const { postId } = params;

    // Validate inputs (post_type, title, content)
    await this.editPostUsecaseProxy
      .getInstance()
      .execute(user.id, postId, editMediaDto);

    return {
      status: 'success',
      message: 'Post updated successfully',
    };
  }
  @UseGuards(JwtAuthGuard)
  @Delete('post/:postId')
  async deletePost(@Req() req: Request, @Param() params: MediaParamsDto) {
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const { postId } = params;
    await this.deletePostUsecaseProxy.getInstance().execute(postId, user.id);
    return {
      status: 'success',
      message: 'Post deleted successfully',
    };
  }
}
