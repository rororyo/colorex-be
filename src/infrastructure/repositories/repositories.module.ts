import { Module } from "@nestjs/common";
import { TypeOrmConfigModule } from "../config/typeorm/typeorm.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepositoryOrm } from "./user/user.repository";
import { AuthRepositoryOrm } from "./auth/auth.repository";
import { User } from "../entities/user.entity";
import { Auth } from "../entities/auth.entity";
import { Post } from "../entities/post.entity";
import { PostRepositoryOrm } from "./posts/post.repository";

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([
    User,
    Auth,
    Post
  ])],
  providers:[UserRepositoryOrm,AuthRepositoryOrm,PostRepositoryOrm],
  exports:[UserRepositoryOrm,AuthRepositoryOrm,PostRepositoryOrm]
})
export class RepositoriesModule {}