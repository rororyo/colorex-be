import { CommentM } from "../../model/comment";
import { EditCommentDto } from "../../../presentations/comment/dto/editComment.dto";

export interface CommentRepository {
  createComment(comment: CommentM ): Promise<void>
  verifyCommentAvailability(commentId: string): Promise<boolean>
  verifyCommentOwnership(userId: string, commentId: string): Promise<boolean>
  getCommentsByPostId(postId: string): Promise<CommentM[]>
  getCommentById(commentId: string): Promise<CommentM>
  editComment(commentId: string,comment: Partial<EditCommentDto>): Promise<void>
  deleteComment(commentId: string): Promise<void>
}