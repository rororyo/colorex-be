import { Injectable } from "@nestjs/common";
import { IMidtrans } from "../../../domains/repositories/payment-gateway/IMidTrans";
import { SubscriptionRepository } from "../../../domains/repositories/subscription/subscription.repository";

@Injectable()
export class CreateSubcriptionPaymentUseCase {
  constructor(
    private readonly midtransService: IMidtrans,
    private readonly subscriptionRepository: SubscriptionRepository
  ){}
  async execute(subscriptionId: string): Promise<{ token: string; redirect_url: string; orderId: string }> {
    await this.subscriptionRepository.verifySubcriptionAvailability(subscriptionId);
    const subscription = await this.subscriptionRepository.getSubscriptionById(subscriptionId);

    const { token, redirect_url } = await this.midtransService.createTransaction(
      subscription.orderId,
      subscription.user.id,
      subscription.amount
    );

    return { token, redirect_url, orderId: subscription.orderId };
  }
}