import { SubscriptionM } from 'src/domains/model/subscription';

export interface SubscriptionRepository {
  createSubscription(userId: string, amount: number): Promise<SubscriptionM>;
  verifySubcriptionAvailability(subscriptionId: string): Promise<boolean>;
  findSubscriptionById(subscriptionId: string): Promise<SubscriptionM>;
}
