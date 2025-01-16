import { CommentM } from "./comment";
import { UserM } from "./user";

export class CommentLikeM{
  id: string;
  user:UserM;
  comment:CommentM;
}
