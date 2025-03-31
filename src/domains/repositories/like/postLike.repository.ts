import { PostLikeM } from "../../model/postLike"


export interface PostLikeRepository {
  createPostLike(postLike: PostLikeM): Promise<void>
  getPostLikeCount(postId: string): Promise<number> 
  verifyIsPostLiked(userId: string, postId: string): Promise<boolean>
  deletePostLike(userId: string, postId: string): Promise<void>
  
}