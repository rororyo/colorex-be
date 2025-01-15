import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { PostType } from "src/domains/model/post";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";
import { PostLike } from "./postLike.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User,(user) => user.posts,{onDelete: 'CASCADE'} )  
  @JoinColumn({ name: 'user_id' })
  user: User;
  
  @Column({
    type: 'enum',
    enum: PostType,
  })
  post_type: PostType;

  @Column()
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

  @OneToMany(() => Comment, (comment) => comment.post,{cascade: true})
  comments: Comment[];

  @OneToMany(()=>PostLike, (postLike) => postLike.post)
  postLikes: PostLike[]
}