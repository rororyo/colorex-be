import { Module } from "@nestjs/common";
import { UseCaseProxyModule } from "src/infrastructure/usecase-proxy/usecase-proxy.module";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "src/infrastructure/auth/strategies/jwt.strategy";

@Module({
  imports:[
    UseCaseProxyModule.register()],
  controllers:[AuthController],
  providers:[
    JwtStrategy
  ],
  exports:[
    JwtStrategy
  ]
})
export class AuthModule {}