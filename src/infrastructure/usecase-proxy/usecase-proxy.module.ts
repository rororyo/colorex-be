import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { UserRepositoryOrm } from '../repositories/user/user.repository';
import { UseCaseProxy } from './usecase-proxy';
import { RegisterUserUsecase } from 'src/applications/use-cases/user/registerUser.usecase';

import * as argon2 from 'argon2';
import Argon2PasswordHash from '../Argon2Passwordhash';
import { JwtTokenManager } from '../JwtTokenManager';
import { LoginUserUsecase } from 'src/applications/use-cases/user/loginUser.usecase';
import { CurrUserUsecase } from 'src/applications/use-cases/user/currUser.usecase';
import { PostRepositoryOrm } from '../repositories/posts/post.repository';
import { PostMediaUsecase } from 'src/applications/use-cases/posts/postMedia.usecase';
import { CommentRepositoryOrm } from '../repositories/comment/comment.repository';
import { PostCommentUsecase } from 'src/applications/use-cases/comment/postComment.usecase';
import { ReplyRepositoryOrm } from '../repositories/reply/reply.repository';
import { postReplyUseCase } from 'src/applications/use-cases/reply/postReply.usecase';
import { getMediaDetailsUsecase } from 'src/applications/use-cases/posts/getMedia.usecase';
import { PostLikeUsecase } from 'src/applications/use-cases/like/postLike.usecase';
import { postLikeRepositoryOrm } from '../repositories/like/postLike.repository';

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
  // usecases
  static LOGIN_USER_USECASE = 'loginUserUsecaseProxy';
  static REGISTER_USER_USECASE = 'registerUserUsecaseProxy';
  static CURRENT_USER_USECASE = 'currentUserUsecaseProxy';
  static POST_MEDIA_USECASE = 'postMediaUsecaseProxy';
  static GET_MEDIA_USECASE = 'getMediaUsecaseProxy';
  static POST_COMMENT_USECASE = 'postCommentUsecaseProxy';
  static POST_REPLY_USECASE = 'postReplyUsecaseProxy';
  static POST_LIKE_USECASE = 'postLikeUsecaseProxy';

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
          useFactory: (jwtService: JwtService) =>
            new JwtTokenManager(jwtService),
        },
        // registering usecases
        {
          inject: [UserRepositoryOrm, Argon2PasswordHash],
          provide: UseCaseProxyModule.REGISTER_USER_USECASE,
          useFactory: (
            userRepository: UserRepositoryOrm,
            passwordHash: Argon2PasswordHash,
          ) =>
            new UseCaseProxy(
              new RegisterUserUsecase(userRepository, passwordHash),
            ),
        },
        {
          inject: [UserRepositoryOrm, JwtTokenManager, Argon2PasswordHash],
          provide: UseCaseProxyModule.LOGIN_USER_USECASE,
          useFactory: (
            userRepository: UserRepositoryOrm,
            authTokenManager: JwtTokenManager,
            passwordHash: Argon2PasswordHash,
          ) =>
            new UseCaseProxy(
              new LoginUserUsecase(
                userRepository,
                authTokenManager,
                passwordHash,
              ),
            ),
        },
        {
          inject: [UserRepositoryOrm, JwtTokenManager],
          provide: UseCaseProxyModule.CURRENT_USER_USECASE,
          useFactory: (
            userRepository: UserRepositoryOrm,
            authTokenManager: JwtTokenManager,
          ) =>
            new UseCaseProxy(
              new CurrUserUsecase(userRepository, authTokenManager),
            ),
        },
        {
          inject: [PostRepositoryOrm, UserRepositoryOrm],
          provide: UseCaseProxyModule.POST_MEDIA_USECASE,
          useFactory: (
            postRepository: PostRepositoryOrm,
            userRepository: UserRepositoryOrm,
          ) => new UseCaseProxy(new PostMediaUsecase(userRepository,postRepository)),
        },
        {
          inject:[UserRepositoryOrm,PostRepositoryOrm,postLikeRepositoryOrm],
          provide:UseCaseProxyModule.POST_LIKE_USECASE,
          useFactory:(
            userRepository:UserRepositoryOrm,
            postRepository:PostRepositoryOrm,
            postLikeRepository:postLikeRepositoryOrm
          )=> new UseCaseProxy(new PostLikeUsecase(userRepository,postRepository,postLikeRepository))
        },
        {
          inject: [PostRepositoryOrm],
          provide: UseCaseProxyModule.GET_MEDIA_USECASE,
          useFactory:(
            postRepository:PostRepositoryOrm
          )=> new UseCaseProxy(new getMediaDetailsUsecase(postRepository))
        },
        {
          inject:[PostRepositoryOrm,UserRepositoryOrm,CommentRepositoryOrm],
          provide:UseCaseProxyModule.POST_COMMENT_USECASE,
          useFactory:(
            postRepository:PostRepositoryOrm,
            userRepository:UserRepositoryOrm,
            commentRepository:CommentRepositoryOrm
          )=> new UseCaseProxy(new PostCommentUsecase(userRepository,postRepository,commentRepository))
        },
        {
          inject:[UserRepositoryOrm,PostRepositoryOrm,CommentRepositoryOrm,ReplyRepositoryOrm],
          provide:UseCaseProxyModule.POST_REPLY_USECASE,
          useFactory:(
            userRepository:UserRepositoryOrm,
            postRepository:PostRepositoryOrm,
            commentRepository:CommentRepositoryOrm,
            replyRepository:ReplyRepositoryOrm
          ) => new UseCaseProxy(new postReplyUseCase(userRepository,postRepository,commentRepository,replyRepository))
        }
      ],
      exports: [
        UseCaseProxyModule.REGISTER_USER_USECASE,
        UseCaseProxyModule.LOGIN_USER_USECASE,
        UseCaseProxyModule.CURRENT_USER_USECASE,
        UseCaseProxyModule.POST_MEDIA_USECASE,
        UseCaseProxyModule.POST_LIKE_USECASE,
        UseCaseProxyModule.GET_MEDIA_USECASE,
        UseCaseProxyModule.POST_COMMENT_USECASE,
        UseCaseProxyModule.POST_REPLY_USECASE,

      ],
    };
  }
}
