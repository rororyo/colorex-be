import { UserM } from "./user";

export class FollowM {
  id: string
  following: UserM
  follower: UserM
  created_at: Date
}