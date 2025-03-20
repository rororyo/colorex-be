import { Injectable } from "@nestjs/common";
import { SubscriptionRepository } from "src/domains/repositories/subscription/subscription.repository";

@Injectable()
export class GetSubscriptionByOrderIdUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository
  ){}
  async execute(orderId: string): Promise<any> {
    return await this.subscriptionRepository.getSubscrtiptionByOrderId(orderId);
  }
} 