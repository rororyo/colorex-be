import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { SubscriptionStatus } from 'src/domains/model/subscription';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.subscription, { 
    cascade: true,
    onDelete: 'CASCADE' 
  })
  @JoinColumn()
  user: User;

  @Column()
  orderId: string;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.pending,
  })
  status: SubscriptionStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;
}