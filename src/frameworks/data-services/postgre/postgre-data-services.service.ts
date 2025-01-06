import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { IDataServices, IGenericRepository } from "src/core";
import { PostgreGenericRepository } from "./postgre-generic-repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./model";
import { Repository } from "typeorm";

@Injectable()
export class PostgreDataServices implements IDataServices, OnApplicationBootstrap 
{
  users: PostgreGenericRepository<User>;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  onApplicationBootstrap() {
    this.users = new PostgreGenericRepository<User>(this.userRepository);
  }
}