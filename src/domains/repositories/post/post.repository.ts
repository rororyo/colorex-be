import { PostM } from 'src/domains/model/post';
import { EditMediaDto } from 'src/presentations/posts/dto/editMedia.dto';

export interface PostRepository {
  createPost(post: PostM): Promise<void>;
  verifyPostAvailability(id: string): Promise<boolean>;
  verifyPostOwnership(userId: string, postId: string): Promise<boolean>;
  getPaginatedPosts(
    searchQuery: string,
    page: number,
    limit: number,
  ): Promise<{ posts: Partial<PostM[]>; total: number }>;

  getPostsByUserId(
    page: number,
    limit: number,
    userId: string,
  ): Promise<{
    posts: Partial<PostM>[];
    total: number;
  }>;
  getPostsByHashTagName(
    page: number,
    limit: number,
    hashTagName: string
  ): Promise<{ posts: Partial<PostM>[]; total: number }>;
  getPostById(id: string): Promise<PostM>;
  getDetailedPostById(id: string): Promise<PostM>;
  editPost(id: string, post: Partial<EditMediaDto>): Promise<void>;
  deletePost(id: string): Promise<void>;
}
