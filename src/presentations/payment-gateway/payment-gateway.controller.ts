import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateSubcriptionPaymentUseCase } from '../../applications/use-cases/payment-gateway/createSubcriptionPayment.usecase';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { UseCaseProxy } from '../../infrastructure/usecase-proxy/usecase-proxy';
import { UseCaseProxyModule } from '../../infrastructure/usecase-proxy/usecase-proxy.module';
import { PostSubscriptionUseCase } from '../../applications/use-cases/subscription/postSubscription.usecase';
import { Request } from 'express';
import { CurrUserUsecase } from '../../applications/use-cases/user/currUser.usecase';
import { getAuthCookie } from '../../utils/auth/get-auth-cookie';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { MidtransWebHookUseCase } from '../../applications/use-cases/payment-gateway/midtransWebHook.usecase';
import { GetSubscriptionByOrderIdUseCase } from 'src/applications/use-cases/payment-gateway/getSubscriptionByOrderId.usecase';

@Controller('api')
export class PaymentGatewayController {
  constructor(
    @Inject(UseCaseProxyModule.CREATE_SUBSCRIPTION_PAYMENT_USECASE)
    private readonly createSubcriptionPaymentUseCaseProxy: UseCaseProxy<CreateSubcriptionPaymentUseCase>,
    @Inject(UseCaseProxyModule.GET_SUBSCRIPTION_USECASE) private readonly getSubscriptionUseCaseProxy: UseCaseProxy<GetSubscriptionByOrderIdUseCase>,
    @Inject(UseCaseProxyModule.POST_SUBSCRIPTION_USECASE) private readonly postSubscriptionUseCaseProxy: UseCaseProxy<PostSubscriptionUseCase>,
    @Inject(UseCaseProxyModule.CURRENT_USER_USECASE) private readonly currUserUseCaseProxy: UseCaseProxy<CurrUserUsecase>,
    @Inject(UseCaseProxyModule.MIDTRANS_WEBHOOK_USECASE) private readonly midtransWebHookUseCaseProxy: UseCaseProxy<MidtransWebHookUseCase>,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get('subscription/:orderId')
  async getSubscription(@Param('orderId') orderId: string) {
    const subscription = await this.getSubscriptionUseCaseProxy.getInstance().execute(orderId);
    return {
      status: 'success',
      message: 'Subscription fetched successfully',
      data: subscription,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('pay/subscription')
  async paySubscription(@Body() createSubscriptionDto: CreateSubscriptionDto, @Req() req: Request) {
    const token = getAuthCookie(req);
    const user = await this.currUserUseCaseProxy.getInstance().execute(token);
    createSubscriptionDto.userId = user.id;
    const subscription = await this.postSubscriptionUseCaseProxy.getInstance().execute(createSubscriptionDto);

    const { token: paymentToken, redirect_url: paymentUrl, orderId } =
      await this.createSubcriptionPaymentUseCaseProxy.getInstance().execute(subscription.id);
    return {
      status: "success",
      message: "Subscription created successfully",
      data: { paymentToken, paymentUrl, orderId },
    };
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
