import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
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
import { getMediaDetailsUsecase } from 'src/applications/use-cases/posts/getMedia.usecase';
import { getMediaDetailsParamsDto } from './dto/detailMedia.dto';
import { PostLikeUsecase } from 'src/applications/use-cases/like/postLike.usecase';

@Controller('api')
export class PostMediaController {
  constructor(
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE)
    private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.POST_MEDIA_USECASE)
    private readonly postMediaUsecaseProxy: UseCaseProxy<PostMediaUsecase>,
    @Inject(UseCaseProxyModule.GET_MEDIA_USECASE)
    private readonly getMediaUsecaseProxy: UseCaseProxy<getMediaDetailsUsecase>,
    @Inject(UseCaseProxyModule.POST_LIKE_USECASE)
    private readonly postLikeUseCaseProxy: UseCaseProxy<PostLikeUsecase>,
  ) {}
  @Get('posts/:postId')
  async getMedia(@Param() params: getMediaDetailsParamsDto) {
    const { postId } = params;
    const post = await this.getMediaUsecaseProxy.getInstance().execute(postId);
    return {
      status: 'success',
      message: 'Post details fetched successfully',
      data: post,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('posts')
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
  @Post('posts/:postId/like')
  async postLike(@Req() req: Request, @Param() params: getMediaDetailsParamsDto) {
    const { postId } = params;
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    await this.postLikeUseCaseProxy.getInstance().execute(postId, user.id);
    return {
      status: 'success',
      message: 'Post like action successfully done',
    }
  }
}
