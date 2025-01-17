import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { FollowRepository } from "src/domains/repositories/follow/follow.repository";

@Injectable()
export class UnfollowUserUseCase {
  constructor(private readonly followRepository: FollowRepository) {}

  async execute(userId: string, followingId: string): Promise<void> {
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
        this.followRepository.decrementFollowerCount(followingId),
        this.followRepository.decrementFollowingCount(userId)
      ]);
    } catch (error) {
      throw new BadRequestException('Failed to remove follow relationship');
    }
  }
}
