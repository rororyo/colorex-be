import { CreateNotificationDto } from "src/presentations/firebase/dto/createNotification.dto";

export interface FirebaseRepository {
  sendNotification(payload: CreateNotificationDto): Promise<void>;
}