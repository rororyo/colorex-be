import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { FollowRepository } from '../../../domains/repositories/follow/follow.repository';
import { FollowM } from '../../../domains/model/follow';
import { UserRepository } from '../../../domains/repositories/user/user.repository';

@Injectable()
export class FollowUserUseCase {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly userRepository: UserRepository

  ) {}

  async execute(userId: string, followingId: string): Promise<string> {
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
        this.userRepository.incrementFollowerCount(followingId),
        this.userRepository.incrementFollowingCount(userId)
      ]);
      return 'User followed successfully';
    } catch (error) {
      console.log(error)
      // Handle potential race conditions or db errors
      throw new BadRequestException('Failed to create follow relationship');
    }
  }
}