import { ConflictException } from "@nestjs/common";
import { UserRepository } from "src/domains/repositories/user/user.repository";
import { EditUserDto } from "src/presentations/auth/dto/editUser.dto";

export class EditUserUsecase {
  constructor(
    private readonly userRepository: UserRepository
  ){}
  async execute(userId: string,profileId: string, editUserDto: EditUserDto) {
    if(editUserDto.username !== undefined) {
      const user = await this.userRepository.verifyUserAvailability({username: editUserDto.username});  
      if(!user) throw new ConflictException('Username already exists');
    }
    await this.userRepository.verifyProfileOwnership(userId, profileId);
    await this.userRepository.editUser(profileId, editUserDto);
  }
}