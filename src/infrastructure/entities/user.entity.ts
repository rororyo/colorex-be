import { Roles } from 'src/domains/model/roles.enum';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Reply } from './reply.entity';
import { PostLike } from './postLike.entity';
import { CommentLike } from './commentLike.entity';
import { ReplyLike } from './replyLike.entity';
import { Follow } from './follow.entity';
import { Message } from './message.entity';

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

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  bio: string;

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

  @OneToMany(() => Post, (post) => post.user, { cascade: true, onDelete: 'CASCADE' })
  posts: Post[];

  @OneToMany(() => PostLike, (postLike) => postLike.user, { cascade: true, onDelete: 'CASCADE' })
  postLikes: PostLike[];

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true, onDelete: 'CASCADE' })
  comments: Comment[];

  @OneToMany(() => CommentLike, (commentLike) => commentLike.user, { cascade: true, onDelete: 'CASCADE' })
  commentLikes: CommentLike[];

  @OneToMany(() => Reply, (reply) => reply.user, { cascade: true, onDelete: 'CASCADE' })
  replies: Reply[];

  @OneToMany(() => ReplyLike, (replyLike) => replyLike.user, { cascade: true, onDelete: 'CASCADE' })
  replyLikes: ReplyLike[];

  @OneToMany(() => Follow, (follow) => follow.follower, { cascade: true, onDelete: 'CASCADE' })
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following, { cascade: true, onDelete: 'CASCADE' })
  followers: Follow[];

  @Column({ default: 0 })
  followersCount: number;

  @Column({ default: 0 })
  followingCount: number;

  @OneToMany(() => Message, (message) => message.sender, { cascade: true, onDelete: 'CASCADE' })
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver, { cascade: true, onDelete: 'CASCADE' })
  receivedMessages: Message[];
}
