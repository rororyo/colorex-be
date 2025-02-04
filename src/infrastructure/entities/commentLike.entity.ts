import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";


@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string
  @ManyToOne(() => User, (user) => user.commentLikes, { onDelete: 'CASCADE' })
  user: User
  @ManyToOne(() => Comment, (comment)=>comment.commentLikes, { onDelete: 'CASCADE' })
  comment: Comment
}