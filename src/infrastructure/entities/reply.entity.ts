import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";
import { replyLike } from "./replyLike.entity";

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

  @OneToMany(()=>replyLike, (replyLike) => replyLike.reply)
  replyLikes: replyLike[]
}