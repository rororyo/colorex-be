import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { FollowRepository } from "../../../domains/repositories/follow/follow.repository";
import { UserRepository } from "../../../domains/repositories/user/user.repository";

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(userId: string, followingId: string): Promise<string> {
    // Prevent self-unfollowing
    if (userId === followingId) {
      throw new UnauthorizedException('Invalid unfollow operation');
    }

    // Check if actually following
    const isFollowing = await this.followRepository.isUserFollowing(
      userId,
      followingId
    );

    if (!isFollowing) {
      throw new BadRequestException('Not following this user');
    }

    // Remove follow relationship and update counts atomically
    try {
      await this.followRepository.deleteFollow(userId, followingId);
      await Promise.all([
        this.userRepository.decrementFollowerCount(followingId),
        this.userRepository.decrementFollowingCount(userId)
      ]);
      return 'User unfollowed successfully';
    } catch (error) {
      console.log(error)
      throw new BadRequestException('Failed to remove follow relationship');
    }
  }
}
