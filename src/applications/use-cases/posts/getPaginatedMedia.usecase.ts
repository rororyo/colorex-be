import { PostLikeRepository } from "src/domains/repositories/like/postLike.repository";
import { PostRepository } from "../../../domains/repositories/post/post.repository";

export class GetPaginatedMediaUsecase {
  constructor(private readonly postRepository: PostRepository,
    private readonly likeRepository: PostLikeRepository
  ) {}
  
  async execute(searchQuery: string, page: number, limit: number, userId: string) {
    const posts =  await this.postRepository.getPaginatedPosts(searchQuery, page, limit);
    for (const post of posts.posts) {
      post.isLiked = await this.likeRepository.verifyIsPostLiked(post.id, userId);
    }
    return posts
  }
}