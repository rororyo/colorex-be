import { DynamicModule, Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { EnvironmentConfigModule } from "../config/environment-config/environment-config.module";
import { RepositoriesModule } from "../repositories/repositories.module";
import { UserRepositoryOrm } from "../repositories/user/user.repository";
import { UseCaseProxy } from "./usecase-proxy";
import { RegisterUserUsecase } from "src/applications/use-cases/user/registerUser.usecase";

import * as argon2 from 'argon2';
import Argon2PasswordHash from "../Argon2Passwordhash";
import { JwtTokenManager } from "../JwtTokenManager";
import { LoginUserUsecase } from "src/applications/use-cases/user/loginUser.usecase";
import { CurrUserUsecase } from "src/applications/use-cases/user/currUser.usecase";

@Module({
  imports: [
    EnvironmentConfigModule,
    RepositoriesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class UseCaseProxyModule {
  static LOGIN_USER_USECASE = 'loginUserUsecaseProxy';
  static REGISTER_USER_USECASE = 'registerUserUsecaseProxy';
  static CURRENT_USER_USECASE = 'currentUserUsecaseProxy';

  static register(): DynamicModule {
    return {
      module: UseCaseProxyModule,
      providers: [
        // external providers
        {
          provide: Argon2PasswordHash,
          useValue: new Argon2PasswordHash(argon2),
        },
        {
          inject: [JwtService],
          provide: JwtTokenManager,
          useFactory: (jwtService: JwtService) => new JwtTokenManager(jwtService),
        },
        // registering usecases
        {
          inject: [UserRepositoryOrm,Argon2PasswordHash],
          provide: UseCaseProxyModule.REGISTER_USER_USECASE,
          useFactory: (userRepository: UserRepositoryOrm, passwordHash: Argon2PasswordHash) =>
            new UseCaseProxy(new RegisterUserUsecase(userRepository, passwordHash)),
        },
        {
          inject: [UserRepositoryOrm, JwtTokenManager, Argon2PasswordHash],
          provide: UseCaseProxyModule.LOGIN_USER_USECASE,
          useFactory: (
            userRepository: UserRepositoryOrm,
            authTokenManager: JwtTokenManager,
            passwordHash: Argon2PasswordHash,
          ) =>
            new UseCaseProxy(new LoginUserUsecase(userRepository, authTokenManager, passwordHash)),
        },
        {
          inject:[UserRepositoryOrm,JwtTokenManager],
          provide:UseCaseProxyModule.CURRENT_USER_USECASE,
          useFactory:(
            userRepository:UserRepositoryOrm,
            authTokenManager:JwtTokenManager
          )=>
            new UseCaseProxy(new CurrUserUsecase(userRepository,authTokenManager))
        },       
      ],
      exports: [
        UseCaseProxyModule.REGISTER_USER_USECASE,
        UseCaseProxyModule.LOGIN_USER_USECASE,
        UseCaseProxyModule.CURRENT_USER_USECASE
      ],
    };
  }
}
