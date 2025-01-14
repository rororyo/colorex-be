import { AuthRepository } from "src/domains/repositories/auth/auth.repository";

export class LogoutUsecase {
  constructor(private authRepository: AuthRepository) {}

  async execute(refreshToken: string) {
    // Delete the refresh token from the database
    await this.authRepository.deleteToken(refreshToken);
  }
}
