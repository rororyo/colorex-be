import { Roles } from "src/domains/model/roles.enum";
import { SubscriptionStatus } from "src/domains/model/subscription";
import { SubscriptionRepository } from "src/domains/repositories/subscription/subscription.repository";
import { UserRepository } from "src/domains/repositories/user/user.repository";

export class HandleExpiredSubscriptionUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subscriptionRepository: SubscriptionRepository
  ){}
  async execute() {
    const expiredSubscriptions = await this.subscriptionRepository.getExpiredSubscriptions()

    if(!expiredSubscriptions) return;

    for (const subscription of expiredSubscriptions) {
      subscription.status = SubscriptionStatus.expired;
      await this.subscriptionRepository.updateSubscription(subscription);

      await this.userRepository.editUser(subscription.user.id, {
        role: Roles.user,
        subscribed_at: null,
      });
    }
  }
}