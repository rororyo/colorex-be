import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRepository } from "src/domains/repositories/user/user.repository";
import { RegisterDto } from "src/presentations/auth/dto/auth.dto";
import { User } from "src/infrastructure/entities/user.entity";
import { UserM } from "src/domains/model/user";


@Injectable()
export class UserRepositoryOrm implements UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  
  async createUser(registerDto: RegisterDto): Promise<void> {
    const user = this.userRepository.create(registerDto);
    await this.userRepository.save(user); 
  }
  async verifyUserAvailability(condition: any): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: condition,
    });
    return user ? false : true;
  }

  async findUser(condition: any): Promise<UserM> {
    const user = await this.userRepository.findOne({
      where: condition,
    });
    if (!user) return null;
    return this.toUserM(user); 
  }
  private toUserM(user: User): UserM {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password,
      role: user.role,
      created_at: user.created_at,
      subscribed_at: user.subscribed_at,
    };
  }
}
