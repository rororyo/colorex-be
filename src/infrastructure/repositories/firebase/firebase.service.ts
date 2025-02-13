import * as admin from 'firebase-admin';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from 'src/presentations/firebase/dto/createNotification.dto';
import { FirebaseRepository } from 'src/domains/repositories/firebase/firebase.repository';


@Injectable()
export class FirebaseService implements FirebaseRepository {
  private messaging: admin.messaging.Messaging;

  constructor() {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    this.messaging = admin.messaging();
  }

  async sendNotification(payload: CreateNotificationDto): Promise<void> {
    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      token: payload.fcmToken,
    };

    try {
      await this.messaging.send(message);
      console.log('Notification sent successfully');
    } catch (error) {
      new BadRequestException('Failed to send notification');
    }
  }
}
