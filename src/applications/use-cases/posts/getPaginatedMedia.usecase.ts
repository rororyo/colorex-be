import { PostRepository } from "../../../domains/repositories/post/post.repository";

export class GetPaginatedMediaUsecase {
  constructor(private readonly postRepository: PostRepository) {}
  
  async execute(searchQuery: string, page: number, limit: number) {
    return await this.postRepository.getPaginatedPosts(searchQuery, page, limit);
  }
}