import { Controller, Get, Inject } from "@nestjs/common";
import { HandleExpiredSubscriptionUseCase } from "src/applications/use-cases/subscription/handleExpiredSubscription.usecase";
import { UseCaseProxy } from "src/infrastructure/usecase-proxy/usecase-proxy";
import { UseCaseProxyModule } from "src/infrastructure/usecase-proxy/usecase-proxy.module";

@Controller('cron')
export class CronController {
  constructor(
    @Inject(UseCaseProxyModule.HANDLE_EXPIRED_SUBSCRIPTION_USECASE)
    private readonly handleExpiredSubscriptionUseCase: UseCaseProxy<HandleExpiredSubscriptionUseCase>,
  ) {}
  @Get('expired-subscriptions')
  async handleExpiredSubscriptions() {
    await this.handleExpiredSubscriptionUseCase.getInstance().execute();
    return { message: 'Expired subscriptions handled successfully' };
  }
}