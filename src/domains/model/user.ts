import { PostM } from "./post";
import { Roles } from "./roles.enum";
import { Post } from "src/infrastructure/entities/post.entity";


export class UserM {
  id: string;
  email: string;
  username: string;
  password: string;
  role: Roles;
  created_at: Date;
  subscribed_at: Date;
  posts: Post[];
}
