import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Reply } from "./reply.entity";

@Entity()
export class replyLike {
  @PrimaryGeneratedColumn('uuid')
  id: string
  @ManyToOne(() => User, (user) => user.replyLikes)
  user: User
  @ManyToOne(() => Reply, (reply) => reply.replyLikes)
  reply: Reply
}