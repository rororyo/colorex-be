import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionM, SubscriptionStatus } from 'src/domains/model/subscription';
import { SubscriptionRepository } from 'src/domains/repositories/subscription/subscription.repository';
import { Subscription } from 'src/infrastructure/entities/subsctiption.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionRepositoryOrm implements SubscriptionRepository {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}
  async createSubscription(userId: string, amount: number): Promise<SubscriptionM> {
    const subscription = this.subscriptionRepository.create({
      user: { id: userId },
      orderId: crypto.randomUUID(),
      status: SubscriptionStatus.pending,
      amount: amount,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))

    });
    return await this.subscriptionRepository.save(subscription);
  }
  async verifySubcriptionAvailability(subscriptionId: string): Promise<boolean> {
    const subscription = await this.subscriptionRepository.findOneBy({ id: subscriptionId });
    if(subscription.status === SubscriptionStatus.pending) return true;
    throw new NotFoundException('Subscription not found');
  }
  async findSubscriptionById(subscriptionId: string): Promise<SubscriptionM> {
    return await this.subscriptionRepository.findOneBy({ id: subscriptionId });
  } 
}
