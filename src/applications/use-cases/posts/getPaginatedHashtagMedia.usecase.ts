import { PostRepository } from "../../../domains/repositories/post/post.repository";

export class GetPaginatedHashtagMediaUsecase {
  constructor(
    private postRepository: PostRepository
  ) {}

  async execute(page: number, limit: number,hashTagName: string, searchQuery: string) {
    return await this.postRepository.getPostsByHashTagName(page,limit,hashTagName,searchQuery);
  }
}