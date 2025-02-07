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
  async verifyProfileOwnership(userId: string, profileId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (user.id !== profileId) throw new ConflictException('You are not the owner of this profile');
    return true;
  }

  async findUser(condition: any): Promise<UserM> {
    const user = await this.userRepository.findOne({
      where: condition,
    });

    if (!user) return null;
    return user;
  }
  
  async editUser(profileId: string, user: Partial<UserM>): Promise<void> {
    await this.userRepository.update({ id: profileId }, user);
  }
  async incrementFollowerCount(userId: string): Promise<void> {
    await this.userRepository.increment({id: userId}, 'followersCount', 1);
    
  }
  async decrementFollowerCount(userId: string): Promise<void> {
    await this.userRepository.decrement({id: userId}, 'followersCount', 1);
    
  }
  async incrementFollowingCount(userId: string): Promise<void> {
    await this.userRepository.increment({id: userId}, 'followingCount', 1);
    
  }
  async decrementFollowingCount(userId: string): Promise<void> {
    await this.userRepository.decrement({id: userId}, 'followingCount', 1);
    
  }
  
}
