import { ConflictException } from "@nestjs/common";
import PasswordHash from "src/applications/security/PasswordHash";
import { UserRepository } from "src/domains/repositories/user/user.repository";
import { RegisterDto } from "src/presentations/auth/dto/auth.dto";

export class RegisterUserUsecase {
  constructor(
    private userRepository: UserRepository,
    private passwordHash: PasswordHash
  ){}
  async execute (registerDto :RegisterDto){
    const isUEmailAvailable = await this.userRepository.verifyUserAvailability({email:registerDto.email});
    if(isUEmailAvailable == false) throw new ConflictException('Email already exists');
    const isUsernameAvailable = await this.userRepository.verifyUserAvailability({username: registerDto.username});
    if(isUsernameAvailable == false) throw new ConflictException('Username already exists');
    registerDto.password = await this.passwordHash.hash(registerDto.password);
    await this.userRepository.createUser(registerDto);
  }
}