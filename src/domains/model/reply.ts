import { CommentM } from "./comment";
import { replyLikeM } from "./replyLike";
import { UserM } from "./user";

export class ReplyM{
  id: string;
  user: UserM;
  comment: CommentM;
  content: string;
  created_at: Date;
  updated_at: Date
  replyLikes: replyLikeM[]
}