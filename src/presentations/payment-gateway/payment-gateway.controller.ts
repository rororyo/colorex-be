import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { CreateSubcriptionPaymentUseCase } from 'src/applications/use-cases/payment-gateway/createSubcriptionPayment.usecase';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { UseCaseProxy } from 'src/infrastructure/usecase-proxy/usecase-proxy';
import { UseCaseProxyModule } from 'src/infrastructure/usecase-proxy/usecase-proxy.module';
import { PostSubscriptionUseCase } from 'src/applications/use-cases/subscription/postSubscription.usecase';
import { Request } from 'express';
import { CurrUserUsecase } from 'src/applications/use-cases/user/currUser.usecase';
import { getAuthCookie } from 'src/utils/auth/get-auth-cookie';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { MidtransWebHookUseCase } from 'src/applications/use-cases/payment-gateway/midtransWebHook.usecase';

@Controller('api')
export class PaymentGatewayController {
  constructor(
    @Inject(UseCaseProxyModule.CREATE_SUBSCRIPTION_PAYMENT_USECASE)
    private readonly createSubcriptionPaymentUseCaseProxy: UseCaseProxy<CreateSubcriptionPaymentUseCase>,
    @Inject(UseCaseProxyModule.POST_SUBSCRIPTION_USECASE) private readonly postSubscriptionUseCaseProxy: UseCaseProxy<PostSubscriptionUseCase>,
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE) private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.MIDTRANS_WEBHOOK_USECASE) private readonly midtransWebHookUseCaseProxy: UseCaseProxy<MidtransWebHookUseCase>,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Post('pay/subscription')

  async paySubscription(@Body() createSubscriptionDto: CreateSubscriptionDto,@Req() req: Request) {
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    createSubscriptionDto.userId = user.id;
    const subscription = await this.postSubscriptionUseCaseProxy.getInstance().execute(createSubscriptionDto);
    const { token:paymentToken, redirect_url: paymentUrl } = await this.createSubcriptionPaymentUseCaseProxy.getInstance().execute(subscription.id);
    return{
      status: 'success',
      message: 'Subscription created successfully',
      data: { paymentToken, paymentUrl },
    }
    
  }
  @Post('payment/midtrans/notification')
  async midtransNotification(@Body() body: any) {
    await this.midtransWebHookUseCaseProxy.getInstance().execute(body);
    return{
      status: 'success',
      message: 'Notification received successfully',
    }
  }
}
