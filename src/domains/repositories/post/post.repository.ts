import { PostM } from '../../model/post';
import { EditMediaDto } from '../../../presentations/posts/dto/editMedia.dto';

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
    searchQuery: string,
  ): Promise<{
    posts: Partial<PostM>[];
    total: number;
  }>;
  getPostsByHashTagName(
    page: number,
    limit: number,
    hashTagName: string,
    searchQuery: string,
  ): Promise<{ posts: Partial<PostM>[]; total: number }>;
  getPostById(id: string): Promise<PostM>;
  getPostsByUserIds(
    page: number,
    limit: number,
    userIds: string[],
    searchQuery: string,
  ): Promise<{ posts: PostM[]; total: number }>;
  getDetailedPostById(id: string): Promise<PostM>;
  editPost(id: string, post: Partial<EditMediaDto>): Promise<void>;
  deletePost(id: string): Promise<void>;
}
