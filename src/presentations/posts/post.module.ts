import { Module } from "@nestjs/common";
import { UseCaseProxyModule } from "src/infrastructure/usecase-proxy/usecase-proxy.module";
import { PostMediaController } from "./post.controller";


@Module({
  imports: [UseCaseProxyModule.register()],
  controllers: [PostMediaController],
})
export class PostModule {}