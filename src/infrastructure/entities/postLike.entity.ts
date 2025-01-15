import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Post } from "./post.entity";

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn('uuid')
  id: string
  @ManyToOne(() => User, (user) => user.postLikes)
  user: User
  @ManyToOne(() => Post, (post) => post.postLikes)
  post: Post
}