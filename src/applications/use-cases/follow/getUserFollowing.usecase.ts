import { Injectable } from "@nestjs/common";
import { FollowRepository } from "src/domains/repositories/follow/follow.repository";

@Injectable()
export class GetUserFollowingUseCase {
  constructor(
    private readonly followRepository: FollowRepository
  ){}
  async execute(userId: string, page: number, limit: number) {
    return await this.followRepository.getFollowingByUserId(userId, page, limit);
  }
}