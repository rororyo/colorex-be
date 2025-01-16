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

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      User,
      Auth,
      Post,
      PostLike,
      Comment,
      CommentLike,
      Reply,
      ReplyLike,
    ]),
  ],
  providers: [
    UserRepositoryOrm,
    AuthRepositoryOrm,
    PostRepositoryOrm,
    PostLikeRepositoryOrm,
    CommentRepositoryOrm,
    CommentLikeRepositoryOrm,
    ReplyRepositoryOrm,
    ReplyLikeRepositoryOrm
  ],
  exports: [
    UserRepositoryOrm,
    AuthRepositoryOrm,
    PostRepositoryOrm,
    PostLikeRepositoryOrm,
    CommentRepositoryOrm,
    CommentLikeRepositoryOrm,
    ReplyRepositoryOrm,
    ReplyLikeRepositoryOrm
  ],
})
export class RepositoriesModule {}
