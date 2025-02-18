import { FollowM } from 'src/domains/model/follow';
import { UserM } from 'src/domains/model/user';

export interface FollowRepository {
  createFollow(follow: FollowM): Promise<void>;
  deleteFollow(userId: string, followingId: string): Promise<void>;
  isUserFollowing(userId: string, followingId: string): Promise<boolean>;

  getFollowersByUserId(userId: string,page: number, limit: number): Promise<{
    followers: UserM[];
    count: number;
  }>;
  getFollowingByUserId(userId: string,page: number, limit: number): Promise<{
    following: UserM[];
    count: number;
  }>;
}
