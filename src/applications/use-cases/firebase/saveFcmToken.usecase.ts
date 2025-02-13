
import { NotFoundException } from "@nestjs/common";
import { UserRepository } from "src/domains/repositories/user/user.repository";
import { EditUserDto } from "src/presentations/auth/dto/editUser.dto";
import { UpdateFCMTokenDto } from "src/presentations/firebase/dto/updateFCMToken.dto";

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