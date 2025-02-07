import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessageM } from "src/domains/model/message";
import { MessageRepository } from "src/domains/repositories/message/message.repository";
import { Message } from "src/infrastructure/entities/message.entity";
import { Repository } from "typeorm";

@Injectable()
export class MessageRepositoryOrm implements MessageRepository  {
  constructor(
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
  ){}
  async createMessage(message: Partial<MessageM>): Promise<void> {
    await this.messageRepository.save(message);
  }
  async getMessages(senderId: string, receiverId: string): Promise<MessageM[]> {
    const messages = await this.messageRepository.find({
      where: [
        { sender: { id: senderId } },
        { receiver: { id: receiverId } },
      ],
    })
    return messages
  }
}