import { CommentRepository } from "src/domains/repositories/comment/comment.repository";


export class DeleteReplyUsecase {
  constructor(
    private commentRepository: CommentRepository
  ) {}
  async execute(commentId: string) {
    await this.commentRepository.verifyCommentAvailability(commentId);
    await this.commentRepository.deleteComment(commentId);
  }
}