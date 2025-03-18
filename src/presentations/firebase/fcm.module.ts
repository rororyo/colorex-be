import { Module } from "@nestjs/common";
import { UseCaseProxyModule } from "../../infrastructure/usecase-proxy/usecase-proxy.module";
import { FcmController } from "./fcm.controller";

@Module({
  imports: [UseCaseProxyModule.register()],
  controllers: [FcmController],
})
export class FirebaseModule {}