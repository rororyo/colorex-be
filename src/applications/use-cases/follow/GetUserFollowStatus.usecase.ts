import { FollowRepository } from "../../../domains/repositories/follow/follow.repository";

export class GetUserFollowStatusUsecase {
  constructor(
    private followRepository: FollowRepository
  ){}

  async execute(userId: string, followingId: string): Promise<boolean> {
    return await this.followRepository.isUserFollowing(userId, followingId);
  }
}