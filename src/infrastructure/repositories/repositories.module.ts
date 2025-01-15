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
import { postLikeRepositoryOrm } from './like/postLike.repository';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([User, Auth, Post,PostLike, Comment, Reply]),
  ],
  providers: [
    UserRepositoryOrm,
    AuthRepositoryOrm,
    PostRepositoryOrm,
    postLikeRepositoryOrm,
    CommentRepositoryOrm,
    ReplyRepositoryOrm,
  ],
  exports: [
    UserRepositoryOrm,
    AuthRepositoryOrm,
    PostRepositoryOrm,
    postLikeRepositoryOrm,
    CommentRepositoryOrm,
    ReplyRepositoryOrm,
  ],
})
export class RepositoriesModule {}
