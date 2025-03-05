import { UserM } from "./user"

export enum SubscriptionStatus{
  pending = 'pending',
  active = 'active',
  expired = 'expired',
  failed = 'failed'
}
export class SubscriptionM{
  id: string
  user: UserM
  orderId: string
  amount: number
  status: SubscriptionStatus
  startDate: Date
  endDate: Date
}