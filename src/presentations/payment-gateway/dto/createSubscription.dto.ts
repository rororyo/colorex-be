import { IsUUID, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @IsUUID()
  @IsOptional()
  userId: string;

  @IsOptional()
  @IsUUID()
  existingSubscriptionId?: string;
}