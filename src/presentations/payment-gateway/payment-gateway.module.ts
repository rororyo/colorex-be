import { Module } from "@nestjs/common";
import { UseCaseProxyModule } from "../../infrastructure/usecase-proxy/usecase-proxy.module";
import { PaymentGatewayController } from "./payment-gateway.controller";

@Module({
  imports:[UseCaseProxyModule.register()],
  controllers: [PaymentGatewayController],
})
export class PaymentGatewayModule {}