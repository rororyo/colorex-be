import { CommentM } from "src/domains/model/comment";
import { CommentRepository } from "src/domains/repositories/comment/comment.repository";

export class EditCommentUsecase {
  constructor(
    private commentRepository: CommentRepository
  ) {}

  async execute(userId: string, commentId: string, content: string) {
    await this.commentRepository.verifyCommentAvailability(commentId);
    await this.commentRepository.verifyCommentOwnership(userId, commentId);
    const comment : Partial<CommentM> = {
      content: content,
      updated_at: new Date()
    }
    await this.commentRepository.editComment(commentId,comment);
  }
}