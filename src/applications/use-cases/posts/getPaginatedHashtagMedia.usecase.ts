import { PostRepository } from "src/domains/repositories/post/post.repository";

export class GetPaginatedHashtagMediaUsecase {
  constructor(
    private postRepository: PostRepository
  ) {}

  async execute(searchQuery: string, page: number, limit: number) {
    return await this.postRepository.getPostsByHashTagName(page, limit, searchQuery);
  }
}