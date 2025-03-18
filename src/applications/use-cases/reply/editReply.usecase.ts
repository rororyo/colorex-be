import { ReplyM } from "../../../domains/model/reply";
import { ReplyRepository } from "../../../domains/repositories/reply/reply.repository";


export class EditReplyUsecase {
  constructor(
    private replyRepository: ReplyRepository
  ) {}

  async execute(userId: string, replyId: string, content: string) {
    await this.replyRepository.verifyReplyAvailability(replyId);
    await this.replyRepository.verifyReplyOwnership(userId, replyId);
    const reply : Partial<ReplyM> = {
      content: content,
      updated_at: new Date()
    }
    await this.replyRepository.editReplyById(replyId,reply);
  }
}