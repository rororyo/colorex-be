import { ConflictException } from "@nestjs/common";
import PasswordHash from "../../../applications/security/PasswordHash";
import { UserRepository } from "../../../domains/repositories/user/user.repository";
import { RegisterDto } from "../../../presentations/auth/dto/auth.dto";

export class RegisterUserUsecase {
  constructor(
    private userRepository: UserRepository,
    private passwordHash: PasswordHash
  ){}
  async execute (registerDto :RegisterDto){
    const isEmailExists = await this.userRepository.verifyUserAvailability({email:registerDto.email});
    if(isEmailExists) throw new ConflictException('Email already exists');
    const isUsernameExists = await this.userRepository.verifyUserAvailability({username: registerDto.username});
    if(isUsernameExists) throw new ConflictException('Username already exists');
    registerDto.password = await this.passwordHash.hash(registerDto.password);
    await this.userRepository.createUser(registerDto);
  }
}