import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { LoginUserUsecase } from 'src/applications/use-cases/user/loginUser.usecase';
import { RegisterUserUsecase } from 'src/applications/use-cases/user/registerUser.usecase';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import { UseCaseProxyModule } from 'src/infrastructure/usecase-proxy/usecase-proxy.module';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { getAuthCookie } from 'src/utils/auth/get-auth-cookie';
import { CurrUserUsecase } from 'src/applications/use-cases/user/currUser.usecase';

@ApiTags('auth') // Group endpoints under the "auth" tag
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(UseCaseProxyModule.REGISTER_USER_USECASE)
    private readonly registerUserUseCaseProxy: UseCaseProxy<RegisterUserUsecase>,
    @Inject(UseCaseProxyModule.LOGIN_USER_USECASE)
    private readonly loginUserUseCaseProxy: UseCaseProxy<LoginUserUsecase>,
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE)
    private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
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
  async logoutUser(@Res({ passthrough: true }) response: Response) {
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
