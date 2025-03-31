import { Module } from "@nestjs/common";
import { MessageController } from "./message.controller";
import { UseCaseProxyModule } from "../../infrastructure/usecase-proxy/usecase-proxy.module";

@Module({
  imports:[UseCaseProxyModule.register()],
  controllers:[MessageController]
})
export class MessageModule{}