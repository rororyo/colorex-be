import { CommentM } from './comment';
import { CommentLikeM } from './commentLike';
import { FollowM } from './follow';
import { MessageM } from './message';
import { PostM } from './post';
import { PostLikeM } from './postLike';
import { ReplyM } from './reply';
import { ReplyLikeM } from './replyLike';
import { ColorType } from './enums/colorType.enum';
import { Roles } from './roles.enum';
import { SubscriptionM } from './subscription';


export class UserM {
  id: string;
  email: string;
  username: string;
  password: string;
  role: Roles;
  avatarUrl: string;
  colorType: ColorType;
  bio: string;
  created_at: Date;
  subscribed_at: Date;
  fcmToken: string;
  posts: PostM[];
  postLikes: PostLikeM[];
  comments: CommentM[];
  commentLikes: CommentLikeM[];
  replies: ReplyM[];
  replyLikes: ReplyLikeM[];
  following: FollowM[];
  followers: FollowM[];
  followersCount: number;
  followingCount: number;
  sentMessages: MessageM[];
  receivedMessages: MessageM[];
  subscription: SubscriptionM
}
