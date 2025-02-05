import { PostRepository } from "src/domains/repositories/post/post.repository";

export class GetPaginatedUserMediaUsecase {
  constructor(private readonly postRepository: PostRepository) {}
  async execute (page: number, limit: number,userId: string,searchQuery: string) {
    return await this.postRepository.getPostsByUserId(page, limit, userId,searchQuery);
  }
}