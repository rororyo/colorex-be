
import { NotFoundException } from "@nestjs/common";
import { MessageM } from "../../../domains/model/message";
import { MessageRepository } from "../../../domains/repositories/message/message.repository";
import { UserRepository } from "../../../domains/repositories/user/user.repository";

export class CreateMessageUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly messageRepository: MessageRepository,
  ) {}
  async execute(senderId: string, receiverId: string, content: string): Promise<void> {
    const sender = await this.userRepository.findUser({ id: senderId });
    const isSenderExist = await this.userRepository.verifyUserAvailability({ id: receiverId });
    if (!isSenderExist) throw new NotFoundException('Receiver not found');
    const receiver = await this.userRepository.findUser({ id: receiverId });
    const message = new MessageM();
    message.sender = sender;
    message.receiver = receiver;
    message.content = content;
    await this.messageRepository.createMessage(message);
  }
}