import { ReplyRepository } from "src/domains/repositories/reply/reply.repository";

export class DeleteReplyUsecase {
  constructor(
    private replyRepository: ReplyRepository
  ) {}
  async execute(replyId: string) {
    await this.replyRepository.verifyReplyAvailability(replyId);
    await this.replyRepository.deleteReply(replyId);
  }
}