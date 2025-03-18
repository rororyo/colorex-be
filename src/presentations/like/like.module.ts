import { Module } from "@nestjs/common";
import { UseCaseProxyModule } from "../../infrastructure/usecase-proxy/usecase-proxy.module";
import { LikeController } from "./like.controller";

@Module({
  imports: [UseCaseProxyModule.register()],
  controllers: [LikeController],
})

export class LikeModule {}