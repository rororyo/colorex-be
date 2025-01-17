import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { FollowRepository } from 'src/domains/repositories/follow/follow.repository';
import { FollowM } from 'src/domains/model/follow';

@Injectable()
export class FollowUserUseCase {
  constructor(private readonly followRepository: FollowRepository) {}

  async execute(userId: string, followingId: string): Promise<void> {
    // Prevent self-following
    if (userId === followingId) {
      throw new UnauthorizedException('Users cannot follow themselves');
    }

    // Check if already following
    const isAlreadyFollowing = await this.followRepository.isUserFollowing(
      userId,
      followingId
    );

    if (isAlreadyFollowing) {
      throw new BadRequestException('Already following this user');
    }

    // Create new follow relationship
    const follow = new FollowM();
    follow.follower = { id: userId } as any; // Type casting as we only need the ID
    follow.following = { id: followingId } as any;

    // Create follow and update counts atomically
    try {
      await this.followRepository.createFollow(follow);
      await Promise.all([
        this.followRepository.incrementFollowerCount(followingId),
        this.followRepository.incrementFollowingCount(userId)
      ]);
    } catch (error) {
      // Handle potential race conditions or db errors
      throw new BadRequestException('Failed to create follow relationship');
    }
  }
}