abstract class AuthenticationTokenManager {
  abstract createRefreshToken(payload: any): Promise<string>;

  abstract createAccessToken(payload: any): Promise<string>;

  abstract verifyRefreshToken(token: string): Promise<boolean>;

  abstract decodePayload(token: string): any;
}

export default AuthenticationTokenManager;
