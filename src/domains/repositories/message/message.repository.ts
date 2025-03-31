import { MessageM } from "../../model/message";

export interface MessageRepository {
  createMessage(message: Partial<MessageM>): Promise<void>
  getMessages(senderId: string, receiverId: string): Promise<Partial<MessageM[]>>
}