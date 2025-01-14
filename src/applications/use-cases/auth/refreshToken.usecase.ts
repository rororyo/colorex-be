// import { UnauthorizedException } from "@nestjs/common";
// import AuthenticationTokenManager from "src/applications/security/AuthTokenManager";
// import { AuthRepository } from "src/domains/repositories/auth/auth.repository";

// export class RefreshTokenUsecase {
//   constructor(
//     private authTokenManager: AuthenticationTokenManager,
//     private authRepository: AuthRepository
//   ) {}

//   async execute(refreshToken: string) {
//     // Validate the refresh token
//     const payload = await this.authTokenManager.verifyRefreshToken(refreshToken);
//     if (!payload) {
//       throw new UnauthorizedException("Invalid refresh token");
//     }

//     // Check if the token exists in the database
//     const isTokenAvailable = await this.authRepository.checkTokenAvailability(refreshToken);
//     if (!isTokenAvailable) {
//       throw new UnauthorizedException("Refresh token not found");
//     }

//     // Generate new tokens
//     const accessToken = await this.authTokenManager.createAccessToken({
//       id: payload.id,
//       email: payload.email,
//     });

//     const newRefreshToken = await this.authTokenManager.createRefreshToken({
//       id: payload.id,
//       email: payload.email,
//     });

//     // Replace the old refresh token with the new one in the database
//     await this.authRepository.deleteToken(refreshToken);
//     await this.authRepository.addToken(newRefreshToken);

//     return { accessToken, refreshToken: newRefreshToken };
//   }
// }
