import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";
import { ReplyLike } from "./replyLike.entity";

@Entity()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (user) => user.replies)
  user: User

  @ManyToOne(() => Comment, (comment) => comment.replies)
  comment: Comment

  @Column()
  content: string
  
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

  @OneToMany(()=>ReplyLike, (replyLike) => replyLike.reply)
  replyLikes: ReplyLike[]

  likeCount?: number
}