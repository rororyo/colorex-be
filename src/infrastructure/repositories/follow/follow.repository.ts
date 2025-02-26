import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FollowM } from "src/domains/model/follow";
import { UserM } from "src/domains/model/user";
import { FollowRepository } from "src/domains/repositories/follow/follow.repository";
import { Follow } from "src/infrastructure/entities/follow.entity";
import { Repository } from "typeorm";

@Injectable()
export class FollowRepositoryOrm implements FollowRepository{
  constructor(
    @InjectRepository(Follow) private readonly followRepository: Repository<Follow>,
  ){}
  async createFollow(follow: FollowM): Promise<void> {
    await this.followRepository.save(follow);
  }
  async deleteFollow(userId: string, followingId: string): Promise<void> {
    await this.followRepository.delete({follower: {id: userId}, following: {id: followingId}});
  }
  async isUserFollowing(userId: string, followingId: string): Promise<boolean> {
    const follow = await this.followRepository.findOne({where: {follower: {id: userId}, following: {id: followingId}}});
    if(follow) return true;
    return false;
  }

  async getFollowersByUserId(userId: string,page: number, limit: number): Promise<{
  followers:  UserM[],
  count: number
  }> {
    const [follows, count] = await this.followRepository.findAndCount({
      where: { following: { id: userId } },
      relations: ['follower'],
      select:{
        follower:{
          id: true,
          username: true,
          avatarUrl: true,
          role: true,
          colorType: true
        }
      },
      skip: (page - 1) * limit,
      take: limit
    });
    return {
      followers: follows.map((follow) => follow.follower),
      count: count
    }
    
  }
  async getFollowingByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ following: UserM[]; count: number }> {
    const [follows, count] = await this.followRepository.findAndCount({
      where: { follower: { id: userId } },
      relations: ['following'],
      select:{
        following:{
          id: true,
          username: true,
          avatarUrl: true,
          role: true,
          colorType: true
        }
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  
    return {
      following: follows.map((follow) => follow.following),
      count,
    };
  }
}