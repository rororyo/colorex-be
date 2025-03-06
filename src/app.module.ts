import { Module } from '@nestjs/common';
import { UseCaseProxyModule } from './infrastructure/usecase-proxy/usecase-proxy.module';
import { AuthModule } from './presentations/auth/auth.module';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { AuthController } from './presentations/auth/auth.controller';
import { PostMediaController } from './presentations/posts/post.controller';
import { PostModule } from './presentations/posts/post.module';
import { CommentModule } from './presentations/comment/comment.module';
import { CommentController } from './presentations/comment/comment.controller';
import { ReplyController } from './presentations/reply/reply.controller';
import { ReplyModule } from './presentations/reply/reply.module';
import { LikeModule } from './presentations/like/like.module';
import { LikeController } from './presentations/like/like.controller';
import { FollowModule } from './presentations/follow/follow.module';
import { FollowController } from './presentations/follow/follow.controller';
import { MessageModule } from './presentations/message/message.module';
import { MessageController } from './presentations/message/message.controller';
import { FcmController } from './presentations/firebase/fcm.controller';
import { FirebaseModule } from './presentations/firebase/fcm.module';
import { StorageModule } from './infrastructure/storage/storage.module';
import { PaymentGatewayModule } from './presentations/payment-gateway/payment-gateway.module';
import { PaymentGatewayController } from './presentations/payment-gateway/payment-gateway.controller';
import { CronModule } from './presentations/cron/cron.module';
import { CronController } from './presentations/cron/cron.controller';

@Module({
  imports: [
    UseCaseProxyModule.register(),
    AuthModule,
    EnvironmentConfigModule,
    PostModule,
    CommentModule,
    ReplyModule,
    LikeModule,
    FollowModule,
    MessageModule,
    StorageModule,
    FirebaseModule,
    PaymentGatewayModule,
    CronModule
  ],
  controllers: [
    AuthController,
    PostMediaController,
    CommentController,
    ReplyController,
    LikeController,
    FollowController,
    MessageController,
    FcmController,
    PaymentGatewayController,
    CronController
  ],
})
export class AppModule {}
