import { postLikeM } from "src/domains/model/postLike";

export interface postLikeRepository {
  createPostLike(postLike: postLikeM): Promise<void>
  verifyIsPostLiked(userId: string, postId: string): Promise<boolean>
  deletePostLike(userId: string, postId: string): Promise<void>
}