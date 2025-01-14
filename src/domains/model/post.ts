import { User } from "src/infrastructure/entities/user.entity";
import { UserM } from "./user";

export class PostM{
  id: string;
  user: User;
  post_type : PostType;
  media_url: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export enum PostType {
  image = 'image',
  video = 'video',
}