import { Module } from "@nestjs/common";
import { UseCaseProxyModule } from "src/infrastructure/usecase-proxy/usecase-proxy.module";
import { CommentController } from "./comment.controller";

@Module({
  imports:[UseCaseProxyModule.register()],
  controllers:[CommentController],
})
export class CommentModule {}