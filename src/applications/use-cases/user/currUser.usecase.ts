import { NotFoundException } from '@nestjs/common';
import AuthenticationTokenManager from '../../../applications/security/AuthTokenManager';
import { UserRepository } from '../../../domains/repositories/user/user.repository';

export class CurrUserUsecase {
  constructor(
    private userRepository: UserRepository,
    private authTokenManager: AuthenticationTokenManager,
  ) {}
  async execute(token: string) {
    const payload = await this.authTokenManager.decodePayload(token);
    const user = await this.userRepository.findUser({ id: payload.id });
    if(!user) throw new NotFoundException('User not found');
    const {password, ...rest} = user;
    return rest;
  }
}
