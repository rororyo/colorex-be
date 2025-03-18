import { HashTagM } from "../../../domains/model/hashtag";
import { HashTagRepository } from "../../../domains/repositories/hashtag/hashtag.repository";

export class GetPopularHashtagUseCase {
  constructor(private readonly hashTagRepository: HashTagRepository) {}
  async execute(): Promise<HashTagM[]> {
    return await this.hashTagRepository.getPopularHashtags();
  }
}