import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { PostType } from "src/domains/model/post";
import { User } from "./user.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User,(user) => user.posts,{eager: true} )  
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;
  
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
}