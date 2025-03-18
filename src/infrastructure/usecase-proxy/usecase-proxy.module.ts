import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { UserRepositoryOrm } from '../repositories/user/user.repository';
import { UseCaseProxy } from './usecase-proxy';
import { RegisterUserUsecase } from '../../applications/use-cases/user/registerUser.usecase';

import * as argon2 from 'argon2';
import Argon2PasswordHash from '../Argon2Passwordhash';
import { JwtTokenManager } from '../JwtTokenManager';
import { LoginUserUsecase } from '../../applications/use-cases/user/loginUser.usecase';
import { CurrUserUsecase } from '../../applications/use-cases/user/currUser.usecase';
import { PostRepositoryOrm } from '../repositories/posts/post.repository';
import { PostMediaUsecase } from '../../applications/use-cases/posts/postMedia.usecase';
import { CommentRepositoryOrm } from '../repositories/comment/comment.repository';
import { PostCommentUsecase } from '../../applications/use-cases/comment/postComment.usecase';
import { ReplyRepositoryOrm } from '../repositories/reply/reply.repository';
import { postReplyUseCase } from '../../applications/use-cases/reply/postReply.usecase';
import { GetMediaDetailsUsecase } from '../../applications/use-cases/posts/getMedia.usecase';
import { PostLikeUsecase } from '../../applications/use-cases/like/postLike.usecase';
import { CommentLikeRepositoryOrm } from '../repositories/like/commentLike.repository';
import { CommentLikeUsecase } from '../../applications/use-cases/like/commentLike.usecase';
import { ReplyLikeRepositoryOrm } from '../repositories/like/replyLike.repository';
import { ReplyLikeUsecase } from '../../applications/use-cases/like/replyLike.usecasse';
import { PostLikeRepositoryOrm } from '../repositories/like/postLike.repository';
import { DeleteMediaUsecase } from '../../applications/use-cases/posts/deleteMedia.usecase';
import { DeleteCommentUsecase } from '../../applications/use-cases/comment/deleteComment.usecase';
import { DeleteReplyUsecase } from '../../applications/use-cases/reply/deleteReply.usecase';
import { GetPaginatedMediaUsecase } from '../../applications/use-cases/posts/getPaginatedMedia.usecase';
import { EditMediaUsecase } from '../../applications/use-cases/posts/editMedia.usecase';
import { EditCommentUsecase } from '../../applications/use-cases/comment/editComment.usecase';
import { EditReplyUsecase } from '../../applications/use-cases/reply/editReply.usecase';
import { GetPaginatedUserMediaUsecase } from '../../applications/use-cases/posts/getPaginatedUserMedia.usecase';
import { FollowRepositoryOrm } from '../repositories/follow/follow.repository';
import { FollowUserUseCase } from '../../applications/use-cases/follow/followUser.usecase';
import { UnfollowUserUseCase } from '../../applications/use-cases/follow/unfollowUser.usecase';
import { GetUserFollowStatusUsecase } from '../../applications/use-cases/follow/GetUserFollowStatus.usecase';
import { GetUserFollowingUseCase } from '../../applications/use-cases/follow/getUserFollowing.usecase';
import { GetUserFollowerUseCase } from '../../applications/use-cases/follow/getUserFollower.usecase';
import { HashTagRepositoryOrm } from '../repositories/hashtag/hashtag.repository';
import { GetPaginatedHashtagMediaUsecase } from '../../applications/use-cases/posts/getPaginatedHashtagMedia.usecase';
import { GetPagniatedFollowingMediaUseCase } from '../../applications/use-cases/posts/getPaginatedFollowingMedia.usecase';
import { STORAGE_TOKEN, StorageModule } from '../repositories/storage/storage.module';
import { UploadMediaUseCase } from '../../applications/use-cases/media/uploadMedia.usecase';
import { IGcsStorage } from '../../domains/repositories/storage/IgcsStorage';
import { EditUserUsecase } from '../../applications/use-cases/user/editUser.usecase';
import { MessageRepositoryOrm } from '../repositories/message/message.repository';
import { CreateMessageUsecase } from '../../applications/use-cases/message/createMessage.usecase';
import { GetMessagesUsecase } from '../../applications/use-cases/message/getMessages.usecase';
import { FirebaseService } from '../repositories/firebase/firebase.service';
import { PushNotificationUsecase } from '../../applications/use-cases/firebase/pushNotification.usecase';
import { EditFCMTokenUsecase } from '../../applications/use-cases/firebase/saveFcmToken.usecase';
import { DeleteFcmTokenUseCase } from '../../applications/use-cases/firebase/deleteFcmToken.usecase';
import { DeleteStorageMediaUseCase } from '../../applications/use-cases/media/deleteStorageMedia.usecase';
import { getUserByIdUsecase } from '../../applications/use-cases/user/getUserById.usecase';
import { MidtransModule, PAYMENT_GATEWAY_TOKEN } from '../repositories/payment-gateway/midtrans.module';
import { CreateSubcriptionPaymentUseCase } from '../../applications/use-cases/payment-gateway/createSubcriptionPayment.usecase';
import { SubscriptionRepositoryOrm } from '../repositories/subcription/subscription.repository';
import { IMidtrans } from '../../domains/repositories/payment-gateway/IMidTrans';
import { PostSubscriptionUseCase } from '../../applications/use-cases/subscription/postSubscription.usecase';
import { MidtransWebHookUseCase } from '../../applications/use-cases/payment-gateway/midtransWebHook.usecase';
import { GetPostLikeStatusUseCase } from '../../applications/use-cases/like/getPostLikeStatus.usecase';
import { GetCommentLikeStatusUsecase } from '../../applications/use-cases/like/getCommentLikeStatus.usecase';
import { GetReplyLikeStatusUsecase } from '../../applications/use-cases/like/getReplyLikeStatus.usecase';
import { HandleExpiredSubscriptionUseCase } from '../../applications/use-cases/subscription/handleExpiredSubscription.usecase';

@Module({
  imports: [
    EnvironmentConfigModule,
    RepositoriesModule,
    MidtransModule,
    StorageModule,
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
  static GET_USER_BY_ID_USECASE = 'getUserByIdUsecaseProxy';
  static EDIT_USER_USECASE = 'editUserUsecaseProxy';
  static UPLOAD_MEDIA_USECASE = 'uploadMediaUsecaseProxy';
  static DELETE_STORAGE_MEDIA_USECASE = 'deleteStorageMediaUsecaseProxy';
  static POST_MEDIA_USECASE = 'postMediaUsecaseProxy';
  static DELETE_POST_USECASE = 'deletePostUsecaseProxy';
  static EDIT_POST_USECASE = 'editPostUsecaseProxy';
  static POST_LIKE_USECASE = 'postLikeUsecaseProxy';
  static GET_POST_LIKE_STATUS_USECASE = 'getPostLikeStatusUsecaseProxy';
  static GET_PAGINATED_MEDIA_USECASE = 'getPaginatedMediaUsecaseProxy';
  static GET_PAGINATED_USER_MEDIA_USECASE = 'getPaginatedUserMediaUsecaseProxy';
  static GET_PAGINATED_HASHTAG_MEDIA_USECASE =
    'getPaginatedHashtagMediaUsecaseProxy';
  static GET_PAGINATED_FOLLOWING_MEDIA_USECASE =
    'getPaginatedFollowingMediaUsecaseProxy';
  static GET_MEDIA_USECASE = 'getMediaUsecaseProxy';
  static POST_COMMENT_USECASE = 'postCommentUsecaseProxy';
  static EDIT_COMMENT_USECASE = 'editCommentUsecaseProxy';
  static DELETE_COMMENT_USECASE = 'deleteCommentUsecaseProxy';
  static COMMENT_LIKE_USECASE = 'commentLikeUsecaseProxy';
  static GET_COMMENT_LIKE_STATUS_USECASE = 'getCommentLikeStatusUsecaseProxy';
  static POST_REPLY_USECASE = 'postReplyUsecaseProxy';
  static EDIT_REPLY_USECASE = 'editReplyUsecaseProxy';
  static DELETE_REPLY_USECASE = 'deleteReplyUsecaseProxy';
  static REPLY_LIKE_USECASE = 'replyLikeUsecaseProxy';
  static GET_REPLY_LIKE_STATUS_USECASE = 'getReplyLikeStatusUsecaseProxy';
  static FOLLOW_USER_USECASE = 'followUserUsecaseProxy';
  static UNFOLLOW_USER_USECASE = 'unfollowUserUsecaseProxy';
  static GET_USER_FOLLOW_STATUS_USECASE = 'getUserFollowStatusUsecaseProxy';
  static GET_USER_FOLLOWERS_USECASE = 'getUserFollowersUsecaseProxy';
  static GET_USER_FOLLOWING_USECASE = 'getUserFollowingUsecaseProxy';
  static POST_MESSAGE_USECASE = 'postMessageUsecaseProxy';
  static GET_MESSAGES_USECASE = 'getMessagesUsecaseProxy';
  static POST_SUBSCRIPTION_USECASE = 'postSubscriptionUsecaseProxy';
  static HANDLE_EXPIRED_SUBSCRIPTION_USECASE = 'handleExpiredSubscriptionUsecaseProxy';
  // FCM
  static SEND_NOTIFICATION_USECASE = 'sendNotificationUsecaseProxy';
  static DELETE_FCM_TOKEN_USECASE = 'deleteFcmTokenUsecaseProxy';
  static EDIT_FCM_TOKEN_USECASE = 'editFcmTokenUsecaseProxy';
  // payment gateway
  static CREATE_SUBSCRIPTION_PAYMENT_USECASE = 'createSubcriptionPaymentUsecaseProxy';
  static MIDTRANS_WEBHOOK_USECASE = 'midtransWebHookUsecaseProxy';
  static register(): DynamicModule {
    return {
      module: UseCaseProxyModule,
      providers: [
        FirebaseService,
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
        {
          inject:[FirebaseService],
          provide:UseCaseProxyModule.SEND_NOTIFICATION_USECASE,
          useFactory:(firebaseService:FirebaseService) => new UseCaseProxy(new PushNotificationUsecase(firebaseService))
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
          inject: [UserRepositoryOrm],
          provide: UseCaseProxyModule.GET_USER_BY_ID_USECASE,
          useFactory: (userRepository: UserRepositoryOrm) =>
            new UseCaseProxy(new getUserByIdUsecase(userRepository)),
        },
        {
          inject: [UserRepositoryOrm],
          provide: UseCaseProxyModule.EDIT_USER_USECASE,
          useFactory: (userRepository: UserRepositoryOrm) =>
            new UseCaseProxy(new EditUserUsecase(userRepository)),
        },
        {
          inject: [STORAGE_TOKEN],
          provide: UseCaseProxyModule.UPLOAD_MEDIA_USECASE,
          useFactory: (gcsStorage: IGcsStorage) =>
            new UseCaseProxy(new UploadMediaUseCase(gcsStorage)),
        },
        {
          inject: [STORAGE_TOKEN],
          provide: UseCaseProxyModule.DELETE_STORAGE_MEDIA_USECASE,
          useFactory: (gcsStorage: IGcsStorage) =>
            new UseCaseProxy(new DeleteStorageMediaUseCase(gcsStorage)),
        },
        {
          inject: [PostRepositoryOrm, UserRepositoryOrm, HashTagRepositoryOrm],
          provide: UseCaseProxyModule.POST_MEDIA_USECASE,
          useFactory: (
            postRepository: PostRepositoryOrm,
            userRepository: UserRepositoryOrm,
            hashtagRepository: HashTagRepositoryOrm,
          ) =>
            new UseCaseProxy(
              new PostMediaUsecase(
                userRepository,
                postRepository,
                hashtagRepository,
              ),
            ),
        },
        {
          inject: [PostRepositoryOrm],
          provide: UseCaseProxyModule.DELETE_POST_USECASE,
          useFactory: (postRepository: PostRepositoryOrm) =>
            new UseCaseProxy(new DeleteMediaUsecase(postRepository)),
        },
        {
          inject: [PostRepositoryOrm, HashTagRepositoryOrm],
          provide: UseCaseProxyModule.EDIT_POST_USECASE,
          useFactory: (
            postRepository: PostRepositoryOrm,
            hashtagRepository: HashTagRepositoryOrm,
          ) =>
            new UseCaseProxy(
              new EditMediaUsecase(postRepository, hashtagRepository),
            ),
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
          inject: [PostRepositoryOrm,PostLikeRepositoryOrm],
          provide: UseCaseProxyModule.GET_POST_LIKE_STATUS_USECASE,
          useFactory: (postRepository:PostRepositoryOrm,postLikeRepository: PostLikeRepositoryOrm) =>
            new UseCaseProxy(new GetPostLikeStatusUseCase(postRepository,postLikeRepository)),
        },
        {
          inject: [PostRepositoryOrm],
          provide: UseCaseProxyModule.GET_PAGINATED_MEDIA_USECASE,
          useFactory: (postRepository: PostRepositoryOrm) =>
            new UseCaseProxy(new GetPaginatedMediaUsecase(postRepository)),
        },
        {
          inject: [PostRepositoryOrm],
          provide: UseCaseProxyModule.GET_PAGINATED_USER_MEDIA_USECASE,
          useFactory: (postRepository: PostRepositoryOrm) =>
            new UseCaseProxy(new GetPaginatedUserMediaUsecase(postRepository)),
        },
        {
          inject: [PostRepositoryOrm],
          provide: UseCaseProxyModule.GET_PAGINATED_HASHTAG_MEDIA_USECASE,
          useFactory: (postRepository: PostRepositoryOrm) =>
            new UseCaseProxy(
              new GetPaginatedHashtagMediaUsecase(postRepository),
            ),
        },
        {
          inject: [PostRepositoryOrm, FollowRepositoryOrm],
          provide: UseCaseProxyModule.GET_PAGINATED_FOLLOWING_MEDIA_USECASE,
          useFactory: (
            postRepository: PostRepositoryOrm,
            followRepository: FollowRepositoryOrm,
          ) =>
            new UseCaseProxy(
              new GetPagniatedFollowingMediaUseCase(
                postRepository,
                followRepository,
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
          provide: UseCaseProxyModule.EDIT_COMMENT_USECASE,
          useFactory: (commentRepository: CommentRepositoryOrm) =>
            new UseCaseProxy(new EditCommentUsecase(commentRepository)),
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
          inject: [CommentRepositoryOrm,CommentLikeRepositoryOrm],
          provide: UseCaseProxyModule.GET_COMMENT_LIKE_STATUS_USECASE,
          useFactory: (commentRepository: CommentRepositoryOrm,commentLikeRepository: CommentLikeRepositoryOrm) =>
            new UseCaseProxy(new GetCommentLikeStatusUsecase(commentRepository,commentLikeRepository)),
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
          provide: UseCaseProxyModule.EDIT_REPLY_USECASE,
          useFactory: (replyRepository: ReplyRepositoryOrm) =>
            new UseCaseProxy(new EditReplyUsecase(replyRepository)),
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
        {
          inject: [ReplyRepositoryOrm,ReplyLikeRepositoryOrm],
          provide: UseCaseProxyModule.GET_REPLY_LIKE_STATUS_USECASE,
          useFactory: (replyRepository: ReplyRepositoryOrm,replyLikeRepository: ReplyLikeRepositoryOrm) =>
            new UseCaseProxy(new GetReplyLikeStatusUsecase(replyRepository,replyLikeRepository)),
        },
        {
          inject: [FollowRepositoryOrm, UserRepositoryOrm],
          provide: UseCaseProxyModule.FOLLOW_USER_USECASE,
          useFactory: (
            followRepository: FollowRepositoryOrm,
            userRepository: UserRepositoryOrm,
          ) =>
            new UseCaseProxy(
              new FollowUserUseCase(followRepository, userRepository),
            ),
        },
        {
          inject: [FollowRepositoryOrm, UserRepositoryOrm],
          provide: UseCaseProxyModule.UNFOLLOW_USER_USECASE,
          useFactory: (
            followRepository: FollowRepositoryOrm,
            userRepository: UserRepositoryOrm,
          ) =>
            new UseCaseProxy(
              new UnfollowUserUseCase(followRepository, userRepository),
            ),
        },
        {
          inject: [FollowRepositoryOrm],
          provide: UseCaseProxyModule.GET_USER_FOLLOW_STATUS_USECASE,
          useFactory: (followRepository: FollowRepositoryOrm) =>
            new UseCaseProxy(new GetUserFollowStatusUsecase(followRepository)),
        },
        {
          inject: [FollowRepositoryOrm],
          provide: UseCaseProxyModule.GET_USER_FOLLOWING_USECASE,
          useFactory: (followRepository: FollowRepositoryOrm) =>
            new UseCaseProxy(new GetUserFollowingUseCase(followRepository)),
        },
        {
          inject: [FollowRepositoryOrm],
          provide: UseCaseProxyModule.GET_USER_FOLLOWERS_USECASE,
          useFactory: (followRepository: FollowRepositoryOrm) =>
            new UseCaseProxy(new GetUserFollowerUseCase(followRepository)),
        },
        {
          inject: [MessageRepositoryOrm, UserRepositoryOrm],
          provide: UseCaseProxyModule.POST_MESSAGE_USECASE,
          useFactory: (
            messageRepository: MessageRepositoryOrm,
            userRepository: UserRepositoryOrm,
          ) =>
            new UseCaseProxy(
              new CreateMessageUsecase(userRepository, messageRepository),
            ),
        },
        {
          inject: [MessageRepositoryOrm, UserRepositoryOrm],
          provide: UseCaseProxyModule.GET_MESSAGES_USECASE,
          useFactory: (
            messageRepository: MessageRepositoryOrm,
            userRepository: UserRepositoryOrm,
          ) =>
            new UseCaseProxy(
              new GetMessagesUsecase(messageRepository, userRepository),
            ),
        },
        {
          inject: [UserRepositoryOrm],
          provide: UseCaseProxyModule.EDIT_FCM_TOKEN_USECASE,
          useFactory: (userRepository: UserRepositoryOrm) =>
            new UseCaseProxy(new EditFCMTokenUsecase(userRepository)),
        },
        {
          inject:[UserRepositoryOrm],
          provide:UseCaseProxyModule.DELETE_FCM_TOKEN_USECASE,
          useFactory:(userRepository:UserRepositoryOrm)=> new UseCaseProxy(new DeleteFcmTokenUseCase(userRepository))
        },
        {
          inject: [UserRepositoryOrm,SubscriptionRepositoryOrm],
          provide: UseCaseProxyModule.POST_SUBSCRIPTION_USECASE,
          useFactory: (userRepository: UserRepositoryOrm,subscriptionRepository: SubscriptionRepositoryOrm) =>
            new UseCaseProxy(new PostSubscriptionUseCase(userRepository,subscriptionRepository)),
        },
        {
          inject:[UserRepositoryOrm,SubscriptionRepositoryOrm],
          provide:UseCaseProxyModule.HANDLE_EXPIRED_SUBSCRIPTION_USECASE,
          useFactory:(userRepository:UserRepositoryOrm,subscriptionRepository:SubscriptionRepositoryOrm)=> new UseCaseProxy(new HandleExpiredSubscriptionUseCase(userRepository,subscriptionRepository))
        },
        {
          inject:[PAYMENT_GATEWAY_TOKEN,SubscriptionRepositoryOrm],
          provide:UseCaseProxyModule.CREATE_SUBSCRIPTION_PAYMENT_USECASE,
          useFactory:(midtransService: IMidtrans,subscriptionRepository:SubscriptionRepositoryOrm  )=> new UseCaseProxy(new CreateSubcriptionPaymentUseCase(midtransService,subscriptionRepository))
        },
        {
          inject:[SubscriptionRepositoryOrm,UserRepositoryOrm],
          provide:UseCaseProxyModule.MIDTRANS_WEBHOOK_USECASE,
          useFactory:(subscriptionRepository:SubscriptionRepositoryOrm,userRepository:UserRepositoryOrm)=> new UseCaseProxy(new MidtransWebHookUseCase(subscriptionRepository,userRepository))
        },
      ],
      exports: [
        //external usecase
        UseCaseProxyModule.SEND_NOTIFICATION_USECASE,
        UseCaseProxyModule.DELETE_FCM_TOKEN_USECASE,
        //internal usecase
        UseCaseProxyModule.REGISTER_USER_USECASE,
        UseCaseProxyModule.LOGIN_USER_USECASE,
        UseCaseProxyModule.CURRENT_USER_USECASE,
        UseCaseProxyModule.GET_USER_BY_ID_USECASE ,
        UseCaseProxyModule.EDIT_USER_USECASE,
        UseCaseProxyModule.UPLOAD_MEDIA_USECASE,
        UseCaseProxyModule.DELETE_STORAGE_MEDIA_USECASE,
        UseCaseProxyModule.POST_MEDIA_USECASE,
        UseCaseProxyModule.DELETE_POST_USECASE,
        UseCaseProxyModule.EDIT_POST_USECASE,
        UseCaseProxyModule.POST_LIKE_USECASE,
        UseCaseProxyModule.GET_POST_LIKE_STATUS_USECASE,
        UseCaseProxyModule.GET_PAGINATED_MEDIA_USECASE,
        UseCaseProxyModule.GET_PAGINATED_USER_MEDIA_USECASE,
        UseCaseProxyModule.GET_PAGINATED_HASHTAG_MEDIA_USECASE,
        UseCaseProxyModule.GET_PAGINATED_FOLLOWING_MEDIA_USECASE,
        UseCaseProxyModule.GET_MEDIA_USECASE,
        UseCaseProxyModule.POST_COMMENT_USECASE,
        UseCaseProxyModule.EDIT_COMMENT_USECASE,
        UseCaseProxyModule.DELETE_COMMENT_USECASE,
        UseCaseProxyModule.COMMENT_LIKE_USECASE,
        UseCaseProxyModule.GET_COMMENT_LIKE_STATUS_USECASE,
        UseCaseProxyModule.POST_REPLY_USECASE,
        UseCaseProxyModule.EDIT_REPLY_USECASE,
        UseCaseProxyModule.DELETE_REPLY_USECASE,
        UseCaseProxyModule.REPLY_LIKE_USECASE,
        UseCaseProxyModule.GET_REPLY_LIKE_STATUS_USECASE,
        UseCaseProxyModule.FOLLOW_USER_USECASE,
        UseCaseProxyModule.UNFOLLOW_USER_USECASE,
        UseCaseProxyModule.GET_USER_FOLLOW_STATUS_USECASE,
        UseCaseProxyModule.GET_USER_FOLLOWING_USECASE,
        UseCaseProxyModule.GET_USER_FOLLOWERS_USECASE,
        UseCaseProxyModule.POST_MESSAGE_USECASE,
        UseCaseProxyModule.GET_MESSAGES_USECASE,
        UseCaseProxyModule.EDIT_FCM_TOKEN_USECASE,
        UseCaseProxyModule.POST_SUBSCRIPTION_USECASE,
        UseCaseProxyModule.HANDLE_EXPIRED_SUBSCRIPTION_USECASE,
        UseCaseProxyModule.CREATE_SUBSCRIPTION_PAYMENT_USECASE,
        UseCaseProxyModule.MIDTRANS_WEBHOOK_USECASE,
      ],
    };
  }
}
