import { Injectable } from "@nestjs/common";
import { SubscriptionRepository } from "src/domains/repositories/subscription/subscription.repository";

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository
  ){}
  async execute (userId: string, amount: number) {
    return await this.subscriptionRepository.createSubscription(userId, amount);
  }
}