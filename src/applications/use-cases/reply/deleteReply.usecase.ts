import { ReplyRepository } from "../../../domains/repositories/reply/reply.repository";

export class DeleteReplyUsecase {
  constructor(
    private replyRepository: ReplyRepository
  ) {}
  async execute(userId: string, replyId: string) {
    await this.replyRepository.verifyReplyAvailability(replyId);
    await this.replyRepository.verifyReplyOwnership(userId, replyId);
    await this.replyRepository.deleteReply(replyId);
  }
}