import { Module } from "@nestjs/common";
import { UseCaseProxyModule } from "src/infrastructure/usecase-proxy/usecase-proxy.module";
import { ReplyController } from "./reply.controller";

@Module({
  imports:[UseCaseProxyModule.register()],
  controllers:[ReplyController],
})
export class ReplyModule {}