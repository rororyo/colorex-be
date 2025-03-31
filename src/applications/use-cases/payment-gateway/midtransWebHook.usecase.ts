import { Injectable } from '@nestjs/common';
import { Roles } from '../../..//domains/model/roles.enum';
import { SubscriptionStatus } from '../../..//domains/model/subscription';
import { SubscriptionRepository } from '../../../domains/repositories/subscription/subscription.repository';
import { UserRepository } from '../../../domains/repositories/user/user.repository';

@Injectable()
export class MidtransWebHookUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async execute(notification: {
    order_id: string;
    transaction_status: string;
  }) {
    const { order_id, transaction_status } = notification;
    await this.subscriptionRepository.verifySubsptionAvailabilityByOrderId(
      order_id,
    );
    const subscription =
      await this.subscriptionRepository.getSubscrtiptionByOrderId(order_id);
    if (
      transaction_status === 'settlement' ||
      transaction_status === 'capture'
    ) {
      subscription.status = SubscriptionStatus.active;
      await this.subscriptionRepository.updateSubscription(subscription);
      await this.userRepository.editUser(subscription.user.id, {
        role: Roles.premiumUser,
        subscribed_at: new Date(),
      });
    } else if (
      transaction_status === 'expire' ||
      transaction_status === 'cancel'
    ) {
      subscription.status = SubscriptionStatus.expired;
      await this.subscriptionRepository.updateSubscription(subscription);
    }
    else{
      subscription.status = SubscriptionStatus.failed;
      await this.subscriptionRepository.updateSubscription(subscription);
    }
  }
}
