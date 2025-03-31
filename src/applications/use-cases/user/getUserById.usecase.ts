import { UserRepository } from "../../../domains/repositories/user/user.repository";

export class getUserByIdUsecase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}
  async execute(userId: string) {
    await this.userRepository.verifyUserAvailability({id: userId});
    const { password, ...user } = await this.userRepository.findUser({id: userId});
    return user;
  }
}