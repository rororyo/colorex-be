
import { UserM } from "src/domains/model/user";
import { RegisterDto } from "src/presentations/auth/dto/auth.dto";


export interface UserRepository {
  createUser(user: RegisterDto): Promise<void>;
  verifyUserAvailability(condition: any): Promise<boolean>;
  findUser(condition:any):Promise<UserM>;
}