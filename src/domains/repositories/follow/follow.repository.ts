import { FollowM } from "src/domains/model/follow"
import { UserM } from "src/domains/model/user"

export interface FollowRepository {
  createFollow(follow: FollowM): Promise<void>
  deleteFollow(userId: string, followingId: string): Promise<void>
  isUserFollowing(userId: string, followingId: string): Promise<boolean>
  incrementFollowerCount(userId: string): Promise<void>
  decrementFollowerCount(userId: string): Promise<void>
  incrementFollowingCount(userId: string): Promise<void>
  decrementFollowingCount(userId: string): Promise<void>
  getFollowersByUserId(userId: string): Promise<UserM[]>
  getFollowingByUserId(userId: string): Promise<UserM[]>
}