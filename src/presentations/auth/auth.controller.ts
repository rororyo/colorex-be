import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { LoginUserUsecase } from 'src/applications/use-cases/user/loginUser.usecase';
import { RegisterUserUsecase } from 'src/applications/use-cases/user/registerUser.usecase';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import { UseCaseProxyModule } from 'src/infrastructure/usecase-proxy/usecase-proxy.module';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { getAuthCookie } from 'src/utils/auth/get-auth-cookie';
import { CurrUserUsecase } from 'src/applications/use-cases/user/currUser.usecase';

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
  @Get('current-user')
  async getCurrentUser(@Req()req:Request){
    const cookie = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(cookie);
    return {
      status: 'success',
      message: 'User data fetched successfully',
      data: user
    }
  }

  @Post('register')
  async registerUser(@Body() registerDto: RegisterDto) {
    await this.registerUserUseCaseProxy.getInstance().execute(registerDto);
    return {
      status: 'success',
      message: 'User registered successfully',
    };
  }
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
