import { Injectable } from '@nestjs/common';
import { FirebaseRepository } from '../../../domains/repositories/firebase/firebase.repository';
import { CreateNotificationDto } from '../../../presentations/firebase/dto/createNotification.dto';

@Injectable()
export class PushNotificationUsecase {
  constructor(private readonly firebaseRepository: FirebaseRepository) {}


  async execute(payload: CreateNotificationDto): Promise<void> {
    await this.firebaseRepository.sendNotification(payload);
  }
}
