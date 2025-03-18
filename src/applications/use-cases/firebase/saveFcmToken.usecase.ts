
import { NotFoundException } from "@nestjs/common";
import { UserRepository } from "../../../domains/repositories/user/user.repository";
import { UpdateFCMTokenDto } from "../../../presentations/firebase/dto/updateFCMToken.dto";

export class EditFCMTokenUsecase {
  constructor(
    private readonly userRepository: UserRepository
  ){}
  async execute(userId: string, UpdateFCMTokenDto:UpdateFCMTokenDto) {
    const user = await this.userRepository.verifyUserAvailability({id: userId});
    if(!user) throw new NotFoundException('User not found');
    await this.userRepository.editUser(userId, UpdateFCMTokenDto);
  }
}