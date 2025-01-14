import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthRepository } from "src/domains/repositories/auth/auth.repository";
import { Auth } from "src/infrastructure/entities/auth.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthRepositoryOrm implements AuthRepository {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
  ){}
  async addToken(token: string): Promise<void> {
    await this.authRepository.save({token});
  }
  async checkTokenAvailability(token: string): Promise<boolean> {
    const auth = await this.authRepository.findOneBy({token});
    return auth ? true : false;
  }
  async deleteToken(token: string): Promise<void> {
    await this.authRepository.delete({token});
  }
}