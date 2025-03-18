import { SubscriptionM } from '../../model/subscription';
export interface SubscriptionRepository {
  createSubscription(subcription:SubscriptionM): Promise<SubscriptionM>;
  verifySubcriptionAvailability(subscriptionId: string): Promise<boolean>;
  verifySubsptionAvailabilityByOrderId(orderId: string): Promise<boolean>;
  getSubscriptionById(subscriptionId: string): Promise<SubscriptionM>;
  getSubscrtiptionByOrderId(orderId: string): Promise<SubscriptionM>;
  hasActiveSubscription(userId: string): Promise<boolean>;
  getSubscriptionByUserId(userId: string): Promise<SubscriptionM | null>
  updateSubscription(subscription: SubscriptionM): Promise<SubscriptionM>
  getExpiredSubscriptions(): Promise<SubscriptionM[]|null>
}
