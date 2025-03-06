import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionM, SubscriptionStatus } from 'src/domains/model/subscription';
import { SubscriptionRepository } from 'src/domains/repositories/subscription/subscription.repository';
import { Subscription } from 'src/infrastructure/entities/subsctiption.entity';
import { User } from 'src/infrastructure/entities/user.entity';
import { CreateSubscriptionDto } from 'src/presentations/payment-gateway/dto/createSubscription.dto';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class SubscriptionRepositoryOrm implements SubscriptionRepository {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) {}
  async createSubscription(subscription:Subscription): Promise<Subscription> {
    return await this.subscriptionRepository.save(subscription);
  }

  // Method to check if user has an active subscription
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { 
        user: { id: userId },
        status: SubscriptionStatus.active,
        endDate: MoreThan(new Date()) 
      }
    });
    return !!subscription;
  }
  async verifySubcriptionAvailability(subscriptionId: string): Promise<boolean> {
    const subscription = await this.subscriptionRepository.findOneBy({ id: subscriptionId });
    if(subscription) return true;
    throw new NotFoundException('Subscription not found');
  }
  async verifySubsptionAvailabilityByOrderId(orderId: string): Promise<boolean> {
    const subscription = await this.subscriptionRepository.findOneBy({ orderId });
    if(subscription) return true;
    throw new NotFoundException('Subscription not found');
  }
  
  async getSubscriptionById(subscriptionId: string): Promise<SubscriptionM> {
    return await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
      relations: ['user']
    });
  }
  async getSubscrtiptionByOrderId(orderId: string): Promise<SubscriptionM> {
    return this.subscriptionRepository.findOne({ where: { orderId }, relations: ['user'] });
  }
  async getSubscriptionByUserId(userId: string): Promise<SubscriptionM | null> {
    return this.subscriptionRepository.findOne({ where: { user: { id: userId } } });
  }
  async updateSubscription(subscription: SubscriptionM): Promise<SubscriptionM> {
    return this.subscriptionRepository.save(subscription);
  }

  async getExpiredSubscriptions(): Promise<SubscriptionM[] | null> {
    return this.subscriptionRepository.find({
      where: { endDate: MoreThan(new Date()) },
      relations: ['user']
    });
  }
    
}
