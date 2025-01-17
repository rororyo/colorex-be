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
  async incrementFollowerCount(userId: string): Promise<void> {
    await this.followRepository.increment({id: userId}, 'follower_count', 1);
    
  }
  async decrementFollowerCount(userId: string): Promise<void> {
    await this.followRepository.decrement({id: userId}, 'follower_count', 1);
    
  }
  async incrementFollowingCount(userId: string): Promise<void> {
    await this.followRepository.increment({id: userId}, 'following_count', 1);
    
  }
  async decrementFollowingCount(userId: string): Promise<void> {
    await this.followRepository.decrement({id: userId}, 'following_count', 1);
    
  }
  async getFollowersByUserId(userId: string): Promise<UserM[]> {
    const follows = await this.followRepository.find({where: {following: {id: userId}}});
    return follows.map(follow => follow.follower);
    
  }
  async getFollowingByUserId(userId: string): Promise<UserM[]> {
    const follows = await this.followRepository.find({where: {follower: {id: userId}}});
    return follows.map(follow => follow.following);
  }
}