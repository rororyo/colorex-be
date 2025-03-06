import { PostLikeRepository } from "src/domains/repositories/like/postLike.repository";
import { PostRepository } from "src/domains/repositories/post/post.repository";

export class GetPostLikeStatusUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly postLikeRepository: PostLikeRepository
  ){}
  async execute(postId: string, userId: string) {
    await this.postRepository.verifyPostAvailability(postId);
    const isPostLiked = await this.postLikeRepository.verifyIsPostLiked(userId, postId);
    return isPostLiked;
  }
}