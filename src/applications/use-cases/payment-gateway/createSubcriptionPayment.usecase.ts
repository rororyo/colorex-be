import { Injectable } from "@nestjs/common";
import { IMidtrans } from "src/domains/payment-gateway/IMidTrans";
import { SubscriptionRepository } from "src/domains/repositories/subscription/subscription.repository";

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    private readonly midtransService: IMidtrans,
    private readonly subscriptionRepository: SubscriptionRepository
  ){}
  async execute(subscriptionId: string): Promise<{ redirect_url: string }> {
    await this.subscriptionRepository.verifySubcriptionAvailability(subscriptionId);
    const subscription = await this.subscriptionRepository.findSubscriptionById(subscriptionId);
    return await this.midtransService.createTransaction(subscription.orderId, subscription.user.id, subscription.amount);
  }
}