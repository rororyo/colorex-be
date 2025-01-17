import { PostM, PostType } from 'src/domains/model/post';
import { PostRepository } from 'src/domains/repositories/post/post.repository';
import { EditMediaDto } from 'src/presentations/posts/dto/editMedia.dto';
export interface EditPostInput {
  postType?: PostType;
  title?: string;
  content?: string;
}
export class EditMediaUsecase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(
    userId: string,
    postId: string,
    input: EditPostInput,
  ): Promise<void> {
    // Ensure the post exists
    await this.postRepository.verifyPostAvailability(postId);

    // Ensure the user owns the post
    await this.postRepository.verifyPostOwnership(userId, postId);

    // Prepare the data to update, ignoring undefined fields
    const postToUpdate: Partial<PostM> = {
      ...(input.postType !== undefined && { post_type: input.postType }),
      ...(input.title !== undefined && { title: input.title }),
      ...(input.content !== undefined && { content: input.content }),
      updated_at: new Date(),
    };

    // Update the post
    await this.postRepository.editPost(postId, postToUpdate);
  }
}
