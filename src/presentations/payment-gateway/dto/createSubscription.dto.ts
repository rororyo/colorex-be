import { Transform } from 'class-transformer';
import { IsUUID, IsNumber, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @IsUUID()
  @IsOptional()
  userId: string;

  @IsOptional()
  @IsUUID()
  existingSubscriptionId?: string;
}