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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostMediaUsecase } from 'src/applications/use-cases/posts/postMedia.usecase';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import { UseCaseProxyModule } from 'src/infrastructure/usecase-proxy/usecase-proxy.module';
import { PostMediaDto } from './dto/postMedia.dto';
import { CurrUserUsecase } from 'src/applications/use-cases/user/currUser.usecase';
import { getAuthCookie } from 'src/utils/auth/get-auth-cookie';
import { convertToMediaFile } from 'src/utils/validator/file.validator';
import { GetMediaDetailsUsecase } from 'src/applications/use-cases/posts/getMedia.usecase';
import { MediaParamsDto } from './dto/MediaParams.dto';
import { GetPaginatedMediaUsecase } from 'src/applications/use-cases/posts/getPaginatedMedia.usecase';
import { DeleteMediaUsecase } from 'src/applications/use-cases/posts/deleteMedia.usecase';
import { EditMediaUsecase } from 'src/applications/use-cases/posts/editMedia.usecase';
import { EditMediaDto } from './dto/editMedia.dto';
import { GetPaginatedUserMediaUsecase } from 'src/applications/use-cases/posts/getPaginatedUserMedia.usecase';
import {
  GetHashTagMediaQueryDto,
  GetMediaQueryDto,
  GetUserMediaParamsDto,
} from './dto/getMedia.dto';
import { GetPaginatedHashtagMediaUsecase } from 'src/applications/use-cases/posts/getPaginatedHashtagMedia.usecase';
import { GetPagniatedFollowingMediaUseCase } from 'src/applications/use-cases/posts/getPaginatedFollowingMedia.usecase';
import { UploadMediaUseCase } from 'src/applications/use-cases/media/uploadMedia.usecase';

@ApiTags('media')
@Controller('api')
export class PostMediaController {
  constructor(
    @Inject(UseCaseProxyModule.UPLOAD_MEDIA_USECASE)
    private readonly uploadMediaUsecaseProxy: UseCaseProxy<UploadMediaUseCase>,
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE)
    private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.GET_PAGINATED_MEDIA_USECASE)
    private readonly getPaginatedMediaUsecaseProxy: UseCaseProxy<GetPaginatedMediaUsecase>,
    @Inject(UseCaseProxyModule.GET_MEDIA_USECASE)
    private readonly getMediaUsecaseProxy: UseCaseProxy<GetMediaDetailsUsecase>,
    @Inject(UseCaseProxyModule.GET_PAGINATED_USER_MEDIA_USECASE)
    private readonly getPaginatedUserMediaUsecaseProxy: UseCaseProxy<GetPaginatedUserMediaUsecase>,
    @Inject(UseCaseProxyModule.GET_PAGINATED_HASHTAG_MEDIA_USECASE)
    private readonly getPaginatedHashtagMediaUsecaseProxy: UseCaseProxy<GetPaginatedHashtagMediaUsecase>,
    @Inject(UseCaseProxyModule.GET_PAGINATED_FOLLOWING_MEDIA_USECASE)
    private readonly getPaginatedFollowingMediaUsecaseProxy: UseCaseProxy<GetPagniatedFollowingMediaUseCase>,
    @Inject(UseCaseProxyModule.POST_MEDIA_USECASE)
    private readonly postMediaUsecaseProxy: UseCaseProxy<PostMediaUsecase>,
    @Inject(UseCaseProxyModule.EDIT_POST_USECASE)
    private readonly editPostUsecaseProxy: UseCaseProxy<EditMediaUsecase>,
    @Inject(UseCaseProxyModule.DELETE_POST_USECASE)
    private readonly deletePostUsecaseProxy: UseCaseProxy<DeleteMediaUsecase>,
  ) {}

  @ApiOperation({ summary: 'Get paginated posts with optional search' })
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Posts fetched successfully',
        data: {
          posts: [
            {
              id: 'f905524f-ff87-4a36-9439-fb889b323f82',
              post_type: 'image',
              media_url: 'lorem ipsum',
              title: 'test title',
              content: 'edited post content',
              created_at: '2025-01-14T17:02:52.820Z',
              updated_at: '2025-01-17T07:21:15.807Z',
              user: {
                id: '8eccff6a-f4a7-4502-9103-e725669b9011',
                email: 'test@admin.com',
                username: 'admin',
              },
              likeCount: 1,
            },
          ],
          total: 1,
        },
      },
    },
  })
  @Get('posts')
  async getPaginatedPosts(@Query() getMediaQueryDto: GetMediaQueryDto) {
    const { searchQuery, page, limit } = getMediaQueryDto;
    const posts = await this.getPaginatedMediaUsecaseProxy
      .getInstance()
      .execute(searchQuery, page, limit);
    return {
      status: 'success',
      message: 'Posts fetched successfully',
      data: posts,
    };
  }
  @ApiOperation({ summary: 'Get posts by hashtag' })
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Posts fetched successfully',
        data: {
          posts: [
            {
              id: '9376b3db-0756-44bc-a627-562bcdd95aaf',
              post_type: 'text',
              media_url:
                'https://storage.googleapis.com/colorex-bucket/posts/1738857105070-sepatu.png',
              title: 'test title to be deleted',
              content: 'test content',
              created_at: '2025-02-06T15:51:46.883Z',
              updated_at: '2025-02-06T15:51:46.883Z',
              hashTags: [
                {
                  id: 'df92c61d-f2f0-4945-929b-27c3c7da1b93',
                  name: 'lifestyle',
                },
              ],
              user: {
                id: '95ea813f-3762-4eb2-9336-a4556d73214c',
                email: 'test@mail.com',
                username: 'test',
              },
              likeCount: 0,
            },
          ],
          total: 1,
        },
      },
    },
  })
  @Get('posts/hashtag')
  async getPostsByHashtag(
    @Query() getHashTagMediaQueryDto: GetHashTagMediaQueryDto,
  ) {
    const { page, limit, hashTagName, searchQuery } = getHashTagMediaQueryDto;
    const posts = await this.getPaginatedHashtagMediaUsecaseProxy
      .getInstance()
      .execute(page, limit, hashTagName, searchQuery);
    return {
      status: 'success',
      message: 'Posts fetched successfully',
      data: posts,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @ApiOperation({ summary: 'Get paginated posts from followed users' })
  @ApiResponse({
    status: 200,
    description: 'Posts fetched successfully.',
    schema: {
      example: {
        status: 'success',
        message: 'Posts fetched successfully',
        data: {
          posts: [
            {
              "id": "9376b3db-0756-44bc-a627-562bcdd95aaf",
              "post_type": "text",
              "media_url": "https://storage.googleapis.com/colorex-bucket/posts/1738857105070-sepatu.png",
              "title": "test title to be deleted",
              "content": "test content",
              "created_at": "2025-02-06T15:51:46.883Z",
              "updated_at": "2025-02-06T15:51:46.883Z",
              "hashTags": [
                  {
                      "id": "df92c61d-f2f0-4945-929b-27c3c7da1b93",
                      "name": "lifestyle"
                  }
              ],
              "user": {
                  "id": "95ea813f-3762-4eb2-9336-a4556d73214c",
                  "email": "test@mail.com",
                  "username": "test",
                  "role": "user"
              },
              "likeCount": 0
          },
          ],
          total: 1
        }
      },
    },
  })
  @Get('posts/following')
  async getPaginatedFollowingPosts(
    @Req() req: Request,
    @Query() getMediaQueryDto: GetMediaQueryDto,
  ) {
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const { page, limit, searchQuery } = getMediaQueryDto;
    const posts = await this.getPaginatedFollowingMediaUsecaseProxy
      .getInstance()
      .execute(page, limit, user.id, searchQuery);
    return {
      status: 'success',
      message: 'Posts fetched successfully',
      data: posts,
    };
  }

  @ApiOperation({ summary: 'Get paginated posts for a specific user' })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user whose posts to retrieve',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'User posts retrieved successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Posts fetched successfully',
        data: {
          posts: [
            {
              id: 'f905524f-ff87-4a36-9439-fb889b323f82',
              post_type: 'image',
              media_url: 'lorem ipsum',
              title: 'test title',
              content: 'edited post content',
              created_at: '2025-01-14T17:02:52.820Z',
              updated_at: '2025-01-17T07:21:15.807Z',
              user: {
                id: '8eccff6a-f4a7-4502-9103-e725669b9011',
                email: 'test@admin.com',
                username: 'admin',
                password:
                  '$argon2id$v=19$m=65536,t=3,p=4$RSxRbgC2WQEV9463TTNCPg$d1X5D3Lvk0NS6wyn5hN7MuerP2kZ568nLNnf3zX77Og',
                role: 'user',
                created_at: '2025-01-14T15:40:01.774Z',
                subscribed_at: null,
                followersCount: 0,
                followingCount: 1,
              },
              likeCount: 1,
            },
          ],
          total: 1,
        },
      },
    },
  })
  @Get('posts/user/:userId')
  async getPostsByUserId(
    @Query() getUserMediaQueryDto: GetMediaQueryDto,
    @Param() getMediaParamsDto: GetUserMediaParamsDto,
  ) {
    const { userId } = getMediaParamsDto;
    const { page, limit, searchQuery } = getUserMediaQueryDto;
    const posts = await this.getPaginatedUserMediaUsecaseProxy
      .getInstance()
      .execute(page, limit, userId, searchQuery);
    return {
      status: 'success',
      message: 'Posts fetched successfully',
      data: posts,
    };
  }

  @ApiOperation({ summary: 'Get details of a specific post' })
  @ApiParam({
    name: 'postId',
    description: 'ID of the post to retrieve',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Post details retrieved successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Post details fetched successfully',
        data: {
          id: 'f905524f-ff87-4a36-9439-fb889b323f82',
          user: {
            id: '8eccff6a-f4a7-4502-9103-e725669b9011',
            email: 'test@admin.com',
            username: 'admin',
          },
          post_type: 'image',
          media_url: 'lorem ipsum',
          title: 'test title',
          content: 'edited post content',
          created_at: '2025-01-14T17:02:52.820Z',
          updated_at: '2025-01-17T07:21:15.807Z',
          likeCount: 1,
          comments: [
            {
              id: '2a047d80-d406-424d-bbfa-adc39e20077b',
              content: 'test content edited comment v2',
              created_at: '2025-01-15T09:55:25.740Z',
              updated_at: '2025-01-17T07:52:05.683Z',
              replies: [
                {
                  id: '067798fc-253b-4a61-a191-a96b69fdff4b',
                  content: 'edited reply',
                  created_at: '2025-01-15T09:55:25.740Z',
                  updated_at: '2025-01-17T08:10:21.156Z',
                  user: {
                    id: '8eccff6a-f4a7-4502-9103-e725669b9011',
                    email: 'test@admin.com',
                    username: 'admin',
                  },
                  likeCount: 1,
                },
              ],
              user: {
                id: '8eccff6a-f4a7-4502-9103-e725669b9011',
                email: 'test@admin.com',
                username: 'admin',
              },
              likeCount: 0,
            },
            {
              id: '74acb150-74f2-46e7-872e-144e57b48755',
              content: 'test123',
              created_at: '2025-01-15T09:55:25.740Z',
              updated_at: '2025-01-15T09:55:25.740Z',
              replies: [],
              user: {
                id: '8eccff6a-f4a7-4502-9103-e725669b9011',
                email: 'test@admin.com',
                username: 'admin',
              },
              likeCount: 0,
            },
            {
              id: '7df3e5b2-ed3b-40a4-a57f-e7c32ae45a9b',
              content: 'test123',
              created_at: '2025-01-15T09:55:25.740Z',
              updated_at: '2025-01-15T09:55:25.740Z',
              replies: [],
              user: {
                id: '8eccff6a-f4a7-4502-9103-e725669b9011',
                email: 'test@admin.com',
                username: 'admin',
              },
              likeCount: 0,
            },
          ],
        },
      },
    },
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new media post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Media post creation with file upload',
    type: PostMediaDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Post created successfully',
      },
    },
  })
  @Post('post')
  @UseInterceptors(FileInterceptor('file', { limits: { files: 1 } }))
  async postMedia(
    @Req() req: Request,
    @Body() postMediaDto: PostMediaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    if (file) {
      const imageDestination = `posts/${Date.now()}-${file.originalname}`;
      const imageUrl = await this.uploadMediaUsecaseProxy
        .getInstance()
        .execute(file.buffer, imageDestination, file.mimetype);
      postMediaDto.media_url = imageUrl;
    }

    const mediaFile = file ? convertToMediaFile(file) : null;
    const completePost = {
      ...postMediaDto,
      media: mediaFile,
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiParam({
    name: 'postId',
    description: 'ID of the post to update',
    required: true,
  })
  @ApiBody({ type: EditMediaDto })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Post updated successfully',
      },
    },
  })
  @Put('post/:postId')
  async updatePost(
    @Req() req: Request,
    @Param() params: MediaParamsDto,
    @Body() editMediaDto: EditMediaDto,
  ) {
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    const { postId } = params;

    await this.editPostUsecaseProxy
      .getInstance()
      .execute(user.id, postId, editMediaDto);

    return {
      status: 'success',
      message: 'Post updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({
    name: 'postId',
    description: 'ID of the post to delete',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
    schema: {
      example: {
        status: 'success',
        message: 'Post deleted successfully',
      },
    },
  })
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
