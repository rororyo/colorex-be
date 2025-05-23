import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { LoginUserUsecase } from '../../applications/use-cases/user/loginUser.usecase';
import { RegisterUserUsecase } from '../../applications/use-cases/user/registerUser.usecase';
import { UseCaseProxy } from '../../infrastructure/usecase-proxy/usecase-proxy';
import { UseCaseProxyModule } from '../../infrastructure/usecase-proxy/usecase-proxy.module';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import {  Request, Response } from 'express';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { getAuthCookie } from '../../utils/auth/get-auth-cookie';
import { CurrUserUsecase } from '../../applications/use-cases/user/currUser.usecase';
import { EditUserDto, EditUserParamsDto } from './dto/editUser.dto';
import { EditUserUsecase } from '../../applications/use-cases/user/editUser.usecase';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadMediaUseCase } from '../../applications/use-cases/media/uploadMedia.usecase';
import { DeleteFcmTokenUseCase } from '../../applications/use-cases/firebase/deleteFcmToken.usecase';
import { DeleteStorageMediaUseCase } from '../../applications/use-cases/media/deleteStorageMedia.usecase';
import { GetUserParamsDto } from './dto/getUser.dto';
import { getUserByIdUsecase } from '../../applications/use-cases/user/getUserById.usecase';

@ApiTags('auth') 
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UseCaseProxyModule.UPLOAD_MEDIA_USECASE)
    private readonly uploadMediaUsecaseProxy: UseCaseProxy<UploadMediaUseCase>,
    @Inject(UseCaseProxyModule.DELETE_STORAGE_MEDIA_USECASE)
    private readonly deleteStorageMediaUsecaseProxy: UseCaseProxy<DeleteStorageMediaUseCase>,
    @Inject(UseCaseProxyModule.REGISTER_USER_USECASE)
    private readonly registerUserUseCaseProxy: UseCaseProxy<RegisterUserUsecase>,
    @Inject(UseCaseProxyModule.EDIT_USER_USECASE)
    private readonly editUserUseCaseProxy: UseCaseProxy<EditUserUsecase>,
    @Inject(UseCaseProxyModule.LOGIN_USER_USECASE)
    private readonly loginUserUseCaseProxy: UseCaseProxy<LoginUserUsecase>,
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE)
    private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.GET_USER_BY_ID_USECASE) private readonly getUserByIdUsecaseProxy: UseCaseProxy<getUserByIdUsecase>,
    @Inject(UseCaseProxyModule.DELETE_FCM_TOKEN_USECASE) private readonly deleteFCMTokenUseCaseProxy: UseCaseProxy<DeleteFcmTokenUseCase>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Indicates this endpoint requires authentication
  @ApiOperation({ summary: 'Get current user data' })
  @ApiResponse({
    status: 200,
    description: 'User data fetched successfully.',
    schema: {
      example: {
        status: 'success',
        message: 'User data fetched successfully',
        data: {
          id: '10350c9f-1384-4e9e-9aba-b9eef895a829',
          email: 'test@mail.com',
          username: 'test',
          role: 'user',
          created_at: '2025-01-07T13:46:09.816Z',
          subscribed_at: null,
        },
      },
    },
  })
  @Get('current-user')
  async getCurrentUser(@Req() req: Request) {
    const cookie = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(cookie);
    return {
      status: 'success',
      message: 'User data fetched successfully',
      data: user,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('user/:profileId')
  async getUserById(@Param() params: GetUserParamsDto ) {
    const { profileId } = params;
    const user = await this.getUserByIdUsecaseProxy.getInstance().execute(profileId);
    return user;
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Indicates this endpoint requires authentication
@ApiOperation({ summary: 'Update user profile' })
@ApiParam(EditUserParamsDto)
@ApiConsumes('multipart/form-data')
@ApiBody({
  description :'user edit with file upload for avatar image',
  type:EditUserDto
})
@ApiResponse({
  status: 200,
  description: 'condition where the user updates successfully',
  schema: {
    example: {
      status: 'success',
      message: 'User updated successfully',
    },
  },
})
  @Put('user/:profileId')
  @UseInterceptors(FileInterceptor('file', { limits: { files: 1 } }))
  async updateUser(
    @Req() req: Request,
    @Param() editUserParamsDto: EditUserParamsDto,
    @Body() editUserDto: EditUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const { profileId } = editUserParamsDto;
    const token = getAuthCookie(req);
    const { id: userId,avatarUrl } = await this.currUserUseCaseProxy
      .getInstance()
      .execute(token);
    if(userId !== profileId) throw new UnauthorizedException('You are not the owner of this profile');
    if(file){
      if(avatarUrl){
        const relativePath = decodeURIComponent(
          avatarUrl.replace(`https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/`, '')
        );
        try {
          await this.deleteStorageMediaUsecaseProxy.getInstance().execute(relativePath);
        } catch (error) {
          console.error(`Error during deletion: ${relativePath}`, error);
        }
      }
      const imageDestination = `users/${Date.now()}-${file.originalname}`;
      const imageUrl = await this.uploadMediaUsecaseProxy.getInstance().execute(file.buffer, imageDestination,file.mimetype);
      editUserDto.avatarUrl = imageUrl;
    }
    await this.editUserUseCaseProxy
      .getInstance()
      .execute(userId, profileId, editUserDto);
    return {
      status: 'success',
      message: 'User updated successfully',
    };
  }
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    schema: {
      example: {
        status: 'success',
        message: 'User registered successfully',
      },
    },
  })
  @Post('register')
  async registerUser(@Body() registerDto: RegisterDto) {
    await this.registerUserUseCaseProxy.getInstance().execute(registerDto);
    return {
      status: 'success',
      message: 'User registered successfully',
    };
  }

  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully.',
    schema: {
      example: {
        status: 'success',
        message: 'User logged in successfully',
        data: {
          accessToken: 'jwt-token-example',
          refreshToken: 'refresh-token-example',
        },
      },
    },
  })
  @Post('login')
  async loginUser(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.loginUserUseCaseProxy
      .getInstance()
      .execute(loginDto);

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 * 7,
      path: '/',
    });

    response.setHeader('Authorization', `Bearer ${accessToken}`);

    return {
      status: 'success',
      message: 'User logged in successfully',
      data: {
        accessToken,
        refreshToken,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log out the user' })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully.',
    schema: {
      example: {
        status: 'success',
        message: 'User logged out successfully',
      },
    },
  })
  @Post('logout')
  async logoutUser(@Req() req:Request,@Res({ passthrough: true }) response: Response) {
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    await this.deleteFCMTokenUseCaseProxy.getInstance().execute(user.id);
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
    });

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
    });
    
    response.removeHeader('Authorization');

    return {
      status: 'success',
      message: 'User logged out successfully',
    };
  }
}
