import { Body, Controller, Get, Inject, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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

@Controller('api/posts')
export class PostMediaController {
  constructor(
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE) private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.POST_MEDIA_USECASE)
    private readonly postMediaUsecaseProxy: UseCaseProxy<PostMediaUsecase>,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async postMedia(
    @Req() req: Request,
    @Body() postMediaDto: PostMediaDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const mediaFile = convertToMediaFile(file);
    const completePost = {
      ...postMediaDto,
    };
    
    await this.postMediaUsecaseProxy.getInstance().execute(completePost, user.id);
  }
}
