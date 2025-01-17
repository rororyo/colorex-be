import { PostRepository } from "src/domains/repositories/post/post.repository";

export class GetPaginatedMediaUsecase {
  constructor(private readonly postRepository: PostRepository) {}
  async execute (page: number, limit: number) {
    return await this.postRepository.getPaginatedPosts(page, limit);
  }
}