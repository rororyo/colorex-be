import { PostLikeRepository } from "src/domains/repositories/like/postLike.repository";
import { FollowRepository } from "../../../domains/repositories/follow/follow.repository";
import { PostRepository } from "../../../domains/repositories/post/post.repository";

export class GetPagniatedFollowingMediaUseCase {
  constructor(
    private postRepository: PostRepository,
    private followRepository: FollowRepository,
    private postLikeRepository: PostLikeRepository
  ) {}
  async execute(page: number, limit: number, userId: string, searchQuery: string) {
    const following = await this.followRepository.getFollowingByUserId(userId, page, limit);
    const userFollowingIds = following.following.map(following => following.id);
    const posts = await this.postRepository.getPostsByUserIds(page, limit, userFollowingIds, searchQuery);
    for (const post of posts.posts) {
      post.isLiked = await this.postLikeRepository.verifyIsPostLiked(post.id, userId);
    }
    return posts
  }
}