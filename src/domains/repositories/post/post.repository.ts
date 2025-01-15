import { PostM } from "src/domains/model/post";
import { PostMediaDto } from "src/presentations/posts/dto/postMedia.dto";

export interface PostRepository {
  createPost(post: PostM): Promise<void>
  verifyPostAvailability(id: string): Promise<boolean>
  getPostById(id: string): Promise<PostM>
  getDetailedPostById(id: string): Promise<PostM>
  deletePost(id: string): Promise<void>
}