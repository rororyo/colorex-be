import { Module } from '@nestjs/common';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepositoryOrm } from './user/user.repository';
import { AuthRepositoryOrm } from './auth/auth.repository';
import { User } from '../entities/user.entity';
import { Auth } from '../entities/auth.entity';
import { Post } from '../entities/post.entity';
import { PostRepositoryOrm } from './posts/post.repository';
import { CommentRepositoryOrm } from './comment/comment.repository';
import { Comment } from '../entities/comment.entity';
import { Reply } from '../entities/reply.entity';
import { ReplyRepositoryOrm } from './reply/reply.repository';
import { PostLike } from '../entities/postLike.entity';
import { CommentLike } from '../entities/commentLike.entity';
import { ReplyLike } from '../entities/replyLike.entity';
import { PostLikeRepositoryOrm } from './like/postLike.repository';
import { CommentLikeRepositoryOrm } from './like/commentLike.repository';
import { ReplyLikeRepositoryOrm } from './like/replyLike.repository';
import { FollowRepositoryOrm } from './follow/follow.repository';
import { Follow } from '../entities/follow.entity';
import { HashTag } from '../entities/hashtag.entity';
import { HashTagRepositoryOrm } from './hashtag/hashtag.repository';
import { Message } from '../entities/message.entity';
import { MessageRepositoryOrm } from './message/message.repository';
import { Subscription } from '../entities/subsctiption.entity';
import { SubscriptionRepositoryOrm } from './subcription/subscription.repository';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      User,
      Auth,
      Post,
      HashTag,
      PostLike,
      Comment,
      CommentLike,
      Reply,
      ReplyLike,
      Follow,
      Message,
      Subscription
    ]),
  ],
  providers: [
    UserRepositoryOrm,
    AuthRepositoryOrm,
    PostRepositoryOrm,
    HashTagRepositoryOrm,
    PostLikeRepositoryOrm,
    CommentRepositoryOrm,
    CommentLikeRepositoryOrm,
    ReplyRepositoryOrm,
    ReplyLikeRepositoryOrm,
    FollowRepositoryOrm,
    MessageRepositoryOrm,
    SubscriptionRepositoryOrm
  ],
  exports: [
    UserRepositoryOrm,
    AuthRepositoryOrm,
    PostRepositoryOrm,
    HashTagRepositoryOrm,
    PostLikeRepositoryOrm,
    CommentRepositoryOrm,
    CommentLikeRepositoryOrm,
    ReplyRepositoryOrm,
    ReplyLikeRepositoryOrm,
    FollowRepositoryOrm,
    MessageRepositoryOrm,
    SubscriptionRepositoryOrm
  ],
})
export class RepositoriesModule {}
