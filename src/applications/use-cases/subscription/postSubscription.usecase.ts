import { BadRequestException, Injectable } from "@nestjs/common";
import { SubscriptionM, SubscriptionStatus } from "../../../domains/model/subscription";
import { SubscriptionRepository } from "../../../domains/repositories/subscription/subscription.repository";
import { UserRepository } from "../../../domains/repositories/user/user.repository";
import { CreateSubscriptionDto } from "../../../presentations/payment-gateway/dto/createSubscription.dto";

@Injectable()
export class PostSubscriptionUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository
  ) {}

  async execute(dto: CreateSubscriptionDto): Promise<SubscriptionM> {
    let subscription = await this.subscriptionRepository.getSubscriptionByUserId(dto.userId);

    if (subscription) {
      if (subscription.status === SubscriptionStatus.active) {
        throw new BadRequestException("You already have an active subscription.");
      }

      subscription.orderId = crypto.randomUUID();
      subscription.startDate = new Date();
      subscription.endDate = new Date(new Date().setMonth(new Date().getMonth() + 1));

      return await this.subscriptionRepository.updateSubscription(subscription);
    }

    subscription = new SubscriptionM();
    subscription.user = await this.userRepository.findUser({ id: dto.userId });
    subscription.orderId = crypto.randomUUID();
    subscription.amount = 1;
    subscription.status = SubscriptionStatus.pending;
    subscription.startDate = new Date();
    subscription.endDate = new Date(new Date().setMonth(new Date().getMonth() + 1));

    return await this.subscriptionRepository.createSubscription(subscription);
  }
}
