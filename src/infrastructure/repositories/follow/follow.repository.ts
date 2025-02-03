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

  async getFollowersByUserId(userId: string): Promise<{
  followers:  UserM[],
  count: number
  }> {
    const follows = await this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'], // Ensure the 'follower' relation is loaded
    });
    return {
      followers: follows.map(follow => follow.follower),
      count: follows.length
    }
    
  }
  async getFollowingByUserId(userId: string): Promise<{
    following:  UserM[],
    count: number
    }>  {
      const follows = await this.followRepository.find({
        where: { follower: { id: userId } },
        relations: ['following'], // Ensure the 'follower' relation is loaded
      });
    return {
      following: follows.map(follow => follow.following),
      count: follows.length
    }
  } 
}