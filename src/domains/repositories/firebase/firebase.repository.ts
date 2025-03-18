import { CreateNotificationDto } from "../../../presentations/firebase/dto/createNotification.dto";

export interface FirebaseRepository {
  sendNotification(payload: CreateNotificationDto): Promise<void>;
}