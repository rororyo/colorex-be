import { Roles } from 'src/domains/model/roles.enum';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Reply } from './reply.entity';
import { PostLike } from './postLike.entity';
import { commentLike } from './commentLike.entity';
import { replyLike } from './replyLike.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.user,
  })
  role: Roles;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  subscribed_at: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(()=> PostLike, (postLike) => postLike.user)
  postLikes: PostLike[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(()=> commentLike, (commentLike) => commentLike.user)
  commentLikes: commentLike[];

  @OneToMany(() => Reply, (reply) => reply.user)
  replies: Reply[];

  @OneToMany(()=> replyLike, (replyLike) => replyLike.user)
  replyLikes: replyLike[];
}