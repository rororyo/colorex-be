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
import { GetMediaDetailsUsecase } from 'src/applications/use-cases/posts/getMedia.usecase';
import { PostLikeUsecase } from 'src/applications/use-cases/like/postLike.usecase';
import { CommentLikeRepositoryOrm } from '../repositories/like/commentLike.repository';
import { CommentLikeUsecase } from 'src/applications/use-cases/like/commentLike.usecase';
import { ReplyLikeRepositoryOrm } from '../repositories/like/replyLike.repository';
import { ReplyLikeUsecase } from 'src/applications/use-cases/like/replyLike.usecasse';
import { PostLikeRepositoryOrm } from '../repositories/like/postLike.repository';
import { DeleteMediaUsecase } from 'src/applications/use-cases/posts/deleteMedia.usecase';
import { DeleteCommentUsecase} from 'src/applications/use-cases/comment/deleteComment.usecase';
import { DeleteReplyUsecase } from 'src/applications/use-cases/reply/deleteReply.usecase';

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
  static DELETE_POST_USECASE = 'deletePostUsecaseProxy';
  static POST_LIKE_USECASE = 'postLikeUsecaseProxy';
  static GET_MEDIA_USECASE = 'getMediaUsecaseProxy';
  static POST_COMMENT_USECASE = 'postCommentUsecaseProxy';
  static DELETE_COMMENT_USECASE = 'deleteCommentUsecaseProxy';
  static COMMENT_LIKE_USECASE = 'commentLikeUsecaseProxy';
  static POST_REPLY_USECASE = 'postReplyUsecaseProxy';
  static DELETE_REPLY_USECASE = 'deleteReplyUsecaseProxy';
  static REPLY_LIKE_USECASE = 'replyLikeUsecaseProxy';

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
          ) =>
            new UseCaseProxy(
              new PostMediaUsecase(userRepository, postRepository),
            ),
        },
        {
          inject: [PostRepositoryOrm],
          provide: UseCaseProxyModule.DELETE_POST_USECASE,
          useFactory: (postRepository: PostRepositoryOrm) =>
            new UseCaseProxy(new DeleteMediaUsecase(postRepository)),
        },
        {
          inject: [UserRepositoryOrm, PostRepositoryOrm, PostLikeRepositoryOrm],
          provide: UseCaseProxyModule.POST_LIKE_USECASE,
          useFactory: (
            userRepository: UserRepositoryOrm,
            postRepository: PostRepositoryOrm,
            postLikeRepository: PostLikeRepositoryOrm,
          ) =>
            new UseCaseProxy(
              new PostLikeUsecase(
                userRepository,
                postRepository,
                postLikeRepository,
              ),
            ),
        },
        {
          inject: [PostRepositoryOrm],
          provide: UseCaseProxyModule.GET_MEDIA_USECASE,
          useFactory: (postRepository: PostRepositoryOrm) =>
            new UseCaseProxy(new GetMediaDetailsUsecase(postRepository)),
        },
        {
          inject: [PostRepositoryOrm, UserRepositoryOrm, CommentRepositoryOrm],
          provide: UseCaseProxyModule.POST_COMMENT_USECASE,
          useFactory: (
            postRepository: PostRepositoryOrm,
            userRepository: UserRepositoryOrm,
            commentRepository: CommentRepositoryOrm,
          ) =>
            new UseCaseProxy(
              new PostCommentUsecase(
                userRepository,
                postRepository,
                commentRepository,
              ),
            ),
        },
        {
          inject: [CommentRepositoryOrm],
          provide: UseCaseProxyModule.DELETE_COMMENT_USECASE,
          useFactory: (commentRepository: CommentRepositoryOrm) =>
            new UseCaseProxy(new DeleteCommentUsecase(commentRepository)),
        },
        {
          inject: [
            UserRepositoryOrm,
            CommentRepositoryOrm,
            CommentLikeRepositoryOrm,
          ],
          provide: UseCaseProxyModule.COMMENT_LIKE_USECASE,
          useFactory: (
            userRepository: UserRepositoryOrm,
            commentRepository: CommentRepositoryOrm,
            commentLikeRepository: CommentLikeRepositoryOrm,
          ) =>
            new UseCaseProxy(
              new CommentLikeUsecase(
                userRepository,
                commentRepository,
                commentLikeRepository,
              ),
            ),
        },
        {
          inject: [
            UserRepositoryOrm,
            PostRepositoryOrm,
            CommentRepositoryOrm,
            ReplyRepositoryOrm,
          ],
          provide: UseCaseProxyModule.POST_REPLY_USECASE,
          useFactory: (
            userRepository: UserRepositoryOrm,
            postRepository: PostRepositoryOrm,
            commentRepository: CommentRepositoryOrm,
            replyRepository: ReplyRepositoryOrm,
          ) =>
            new UseCaseProxy(
              new postReplyUseCase(
                userRepository,
                postRepository,
                commentRepository,
                replyRepository,
              ),
            ),
        },
        {
          inject: [ReplyRepositoryOrm],
          provide: UseCaseProxyModule.DELETE_REPLY_USECASE,
          useFactory: (replyRepository: ReplyRepositoryOrm) =>
            new UseCaseProxy(new DeleteReplyUsecase(replyRepository)),
        },
        {
          inject: [
            UserRepositoryOrm,
            ReplyRepositoryOrm,
            ReplyLikeRepositoryOrm,
          ],
          provide: UseCaseProxyModule.REPLY_LIKE_USECASE,
          useFactory: (
            userRepository: UserRepositoryOrm,
            replyRepository: ReplyRepositoryOrm,
            replyLikeRepository: ReplyLikeRepositoryOrm,
          ) =>
            new UseCaseProxy(
              new ReplyLikeUsecase(
                userRepository,
                replyRepository,
                replyLikeRepository,
              ),
            ),
        },
      ],
      exports: [
        UseCaseProxyModule.REGISTER_USER_USECASE,
        UseCaseProxyModule.LOGIN_USER_USECASE,
        UseCaseProxyModule.CURRENT_USER_USECASE,
        UseCaseProxyModule.POST_MEDIA_USECASE,
        UseCaseProxyModule.DELETE_POST_USECASE,
        UseCaseProxyModule.POST_LIKE_USECASE,
        UseCaseProxyModule.GET_MEDIA_USECASE,
        UseCaseProxyModule.POST_COMMENT_USECASE,
        UseCaseProxyModule.DELETE_COMMENT_USECASE,
        UseCaseProxyModule.COMMENT_LIKE_USECASE,
        UseCaseProxyModule.POST_REPLY_USECASE,
        UseCaseProxyModule.DELETE_REPLY_USECASE,
        UseCaseProxyModule.REPLY_LIKE_USECASE,
      ],
    };
  }
}
