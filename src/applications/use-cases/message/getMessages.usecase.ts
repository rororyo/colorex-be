import { NotFoundException } from '@nestjs/common';
import { MessageRepository } from '../../../domains/repositories/message/message.repository';
import { UserRepository } from '../../../domains/repositories/user/user.repository';

export class GetMessagesUsecase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async execute(senderId: string, receiverId: string) {
    const isReceiverExist = await this.userRepository.verifyUserAvailability({
      id: receiverId,
    })
    ;
    if (!isReceiverExist) {
      throw new NotFoundException('Receiver not found');
    }
    return await this.messageRepository.getMessages(senderId, receiverId);
  }
}
