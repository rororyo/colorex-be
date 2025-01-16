import { CommentM } from "./comment";
import { PostLikeM } from "./postLike";
import { UserM } from "./user";

export class PostM{
  id: string;
  user: UserM;
  post_type : PostType;
  media_url: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  comments: CommentM[];
  postLikes: PostLikeM[]
  likeCount?: number
}

export enum PostType {
  image = 'image',
  video = 'video',
}