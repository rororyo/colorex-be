import { PostM, PostType } from '../../../domains/model/post';
import { HashTagRepository } from '../../../domains/repositories/hashtag/hashtag.repository';
import { PostRepository } from '../../../domains/repositories/post/post.repository';
export interface EditPostInput {
  postType?: PostType;
  title?: string;
  content?: string;
  hashtags?: string[];
}

export class EditMediaUsecase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly hashTagRepository: HashTagRepository,
  ) {}

  async execute(
    userId: string,
    postId: string,
    input: EditPostInput,
  ): Promise<void> {
    await this.postRepository.verifyPostAvailability(postId);
    await this.postRepository.verifyPostOwnership(userId, postId);

    const postToUpdate: Partial<PostM> = {
      ...(input.postType !== undefined && { post_type: input.postType }),
      ...(input.title !== undefined && { title: input.title }),
      ...(input.content !== undefined && { content: input.content }),
      updated_at: new Date(),
    };

    if (input.hashtags?.length) {
      await Promise.all(
        input.hashtags.map(async (hashtag) => {
          const existingHashtag = await this.hashTagRepository.verifyHashtagAvailability(hashtag);
          if (!existingHashtag) {
            await this.hashTagRepository.createHashtag(hashtag);
          }
        })
      );
      
      const hashtags = await Promise.all(
        input.hashtags.map(name => this.hashTagRepository.findHashtagByName(name))
      );
      postToUpdate.hashTags = hashtags;
    }

    await this.postRepository.editPost(postId, postToUpdate);
  }
}