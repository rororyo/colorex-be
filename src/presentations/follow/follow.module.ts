import { Module } from "@nestjs/common";
import { UseCaseProxyModule } from "../../infrastructure/usecase-proxy/usecase-proxy.module";
import { FollowController } from "./follow.controller";

@Module({
  imports:[UseCaseProxyModule.register()],
  controllers: [FollowController],
})
export class FollowModule {}