import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Reply } from "./reply.entity";

@Entity()
export class ReplyLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.replyLikes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Reply, (reply) => reply.replyLikes, { onDelete: 'CASCADE' })
  reply: Reply;
}
