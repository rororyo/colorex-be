import { CommentM } from "src/domains/model/comment";

export interface CommentRepository {
  createComment(comment: CommentM ): Promise<void>
  verifyCommentAvailability(commentId: string): Promise<boolean>
  getCommentsByPostId(postId: string): Promise<CommentM[]>
  getCommentById(commentId: string): Promise<CommentM>
  deleteComment(commentId: string): Promise<void>
}