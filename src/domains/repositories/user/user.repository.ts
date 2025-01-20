
import { UserM } from "src/domains/model/user";
import { RegisterDto } from "src/presentations/auth/dto/auth.dto";


export interface UserRepository {
  createUser(user: RegisterDto): Promise<void>;
  verifyUserAvailability(condition: any): Promise<boolean>;
  findUser(condition:any):Promise<UserM>;
  incrementFollowerCount(userId: string): Promise<void>;
  decrementFollowerCount(userId: string): Promise<void>;
  incrementFollowingCount(userId: string): Promise<void>;
  decrementFollowingCount(userId: string): Promise<void>;
}