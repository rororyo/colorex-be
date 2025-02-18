import { FollowRepository } from "src/domains/repositories/follow/follow.repository";
import { PostRepository } from "src/domains/repositories/post/post.repository";

export class GetPagniatedFollowingMediaUseCase {
  constructor(
    private postRepository: PostRepository,
    private followRepository: FollowRepository
  ) {}
  async execute(page: number, limit: number, userId: string, searchQuery: string) {
    const following = await this.followRepository.getFollowingByUserId(userId, page, limit);
    const userFollowingIds = following.following.map(following => following.id);
    const posts = await this.postRepository.getPostsByUserIds(page, limit, userFollowingIds, searchQuery);
    return posts
  }
}