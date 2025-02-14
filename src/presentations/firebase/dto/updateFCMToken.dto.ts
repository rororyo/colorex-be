import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFCMTokenDto {
  @ApiProperty({
    example: 'new_fcm_device_token_123456',
    description: 'The new Firebase Cloud Messaging (FCM) token of the device',
  })
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}
