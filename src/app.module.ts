import { Module } from "@nestjs/common";
import { UseCaseProxyModule } from "./infrastructure/usecase-proxy/usecase-proxy.module";
import { AuthModule } from "./presentations/auth/auth.module";
import { EnvironmentConfigModule } from "./infrastructure/config/environment-config/environment-config.module";
import { AuthController } from "./presentations/auth/auth.controller";

@Module({
  imports:[UseCaseProxyModule.register(),AuthModule,EnvironmentConfigModule],
  controllers:[AuthController],

})
export class AppModule {}