import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLikeM } from '../../../domains/model/postLike';
import { PostLikeRepository } from '../../../domains/repositories/like/postLike.repository';
import { PostLike } from '../../../infrastructure/entities/postLike.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostLikeRepositoryOrm implements PostLikeRepository {
  constructor(
    @InjectRepository(PostLike)
    private readonly postLikeRepository: Repository<PostLike>,
  ) {}
  async createPostLike(postLike: PostLikeM): Promise<void> {
    await this.postLikeRepository.save(postLike);
  }
  async getPostLikeCount(postId: string): Promise<number> {
    return this.postLikeRepository.count({ where: { post: { id: postId } } });
  }

  async verifyIsPostLiked(userId: string, postId: string): Promise<boolean> {
    const postLike = await this.postLikeRepository.findOneBy({
      user: { id: userId },
      post: { id: postId },
    });
    return postLike ? true : false;
  }

  async deletePostLike(userId: string, postId: string): Promise<void> {
    await this.postLikeRepository.delete({
      user: { id: userId },
      post: { id: postId },
    });
  }
}
