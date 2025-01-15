import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { postLikeM } from "src/domains/model/postLike";
import { postLikeRepository } from "src/domains/repositories/like/postLike.repository";
import { PostLike } from "src/infrastructure/entities/postLike.entity";
import { Repository } from "typeorm";

@Injectable()
export class postLikeRepositoryOrm implements postLikeRepository{
  constructor(
    @InjectRepository(PostLike) private readonly postLikeRepository: Repository<PostLike>,
  ){}
  async createPostLike(postLike: postLikeM): Promise<void> {
    await this.postLikeRepository.save(postLike);
  }
  async verifyIsPostLiked(userId: string, postId: string): Promise<boolean> {
    const postLike = await this.postLikeRepository.findOneBy({user: {id: userId}, post: {id: postId}});
    return postLike ? true : false
  }
  async deletePostLike(userId: string, postId: string): Promise<void> {
    await this.postLikeRepository.delete({user: {id: userId}, post: {id: postId}});
  }
}