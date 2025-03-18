import { CommentRepository } from "../../../domains/repositories/comment/comment.repository";


export class DeleteCommentUsecase {
  constructor(
    private commentRepository: CommentRepository
  ) {}
  async execute(commentId: string, userId: string) {
    await this.commentRepository.verifyCommentAvailability(commentId);
    await this.commentRepository.verifyCommentOwnership(userId, commentId);
    await this.commentRepository.deleteComment(commentId);
  }
}