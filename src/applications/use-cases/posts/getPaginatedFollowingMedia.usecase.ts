import { FollowRepository } from "src/domains/repositories/follow/follow.repository";
import { PostRepository } from "src/domains/repositories/post/post.repository";

export class GetPagniatedFollowingMediaUseCase {
  constructor(
    private postRepository: PostRepository,
    private followRepository: FollowRepository
  ) {}
  async execute(userId: string, page: number, limit: number) {
    const following = await this.followRepository.getFollowingByUserId(userId);
    const userFollowingIds = following.following.map(following => following.id);
    const posts = await this.postRepository.getPostsByUserIds(userFollowingIds,page,limit);
    return posts
  }
}