import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PostType } from '../../domains/model/post';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { PostLike } from './postLike.entity';
import { HashTag } from './hashtag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: PostType,
  })
  post_type: PostType;

  @Column({nullable: true})
  media_url: string;

  @Column()
  title: string;

  @Column() 
  content: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: ['remove'] })
  comments: Comment[];

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  postLikes: PostLike[];

  @ManyToMany(() => HashTag, (hashTag) => hashTag.posts)
  @JoinTable()
  hashTags: HashTag[];

  likeCount?: number;
}
