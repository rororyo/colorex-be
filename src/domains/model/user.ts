import { CommentM } from "./comment";
import { commentLikeM } from "./commentLike";
import { PostM } from "./post";
import { postLikeM } from "./postLike";
import { ReplyM } from "./reply";
import { replyLikeM } from "./replyLike";
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
  posts: PostM[];
  postLikes: postLikeM[];
  comments: CommentM[];
  commentLikes: commentLikeM[];
  replies: ReplyM[];
  replyLikes: replyLikeM[];

}
