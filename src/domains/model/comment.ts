import { CommentLikeM } from "./commentLike"
import { PostM } from "./post"
import { ReplyM } from "./reply"
import { UserM } from "./user"

export class CommentM {
  id:string
  user:UserM
  post: PostM
  content:string
  replies: ReplyM[]
  created_at:Date
  updated_at:Date
commentLikes: CommentLikeM[]
likeCount?:number
}