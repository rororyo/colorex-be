import { Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, Unique, Column } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'followerId' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'followingId' })
  following: User;

  @CreateDateColumn()
  created_at: Date;
}