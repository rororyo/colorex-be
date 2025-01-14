export interface AuthRepository {
  addToken(token: string): Promise<void>;
  checkTokenAvailability(token: string): Promise<boolean>;
  deleteToken(token: string): Promise<void>;
}

