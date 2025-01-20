import { Injectable } from "@nestjs/common";
import { FollowRepository } from "src/domains/repositories/follow/follow.repository";

@Injectable()
export class GetUserFollowerUseCase {
  constructor(
    private readonly followRepository: FollowRepository,
  ){}
  async execute(userId: string) {
    return await this.followRepository.getFollowersByUserId(userId);
  }
}