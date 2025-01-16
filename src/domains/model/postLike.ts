import { PostM } from "./post";
import { UserM } from "./user";

export class PostLikeM{
  id: string;
  user:UserM;
  post:PostM;
}
