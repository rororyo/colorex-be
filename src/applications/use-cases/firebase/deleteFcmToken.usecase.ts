import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../../domains/repositories/user/user.repository";

@Injectable()
export class DeleteFcmTokenUseCase {
  constructor(
    private readonly userRepository:UserRepository
  ){}
  async execute(userId: string): Promise<void> {
    await this.userRepository.deleteFCMToken(userId);
  }
}