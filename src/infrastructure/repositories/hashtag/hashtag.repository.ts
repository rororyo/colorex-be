import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashTagM } from 'src/domains/model/hashtag';
import { HashTagRepository } from 'src/domains/repositories/hashtag/hashtag.repository';
import { HashTag } from 'src/infrastructure/entities/hashtag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HashTagRepositoryOrm implements HashTagRepository {
  constructor(
    @InjectRepository(HashTag)
    private readonly hashTagRepository: Repository<HashTag>,
  ) {}
  async createHashtag(name: string): Promise<void> {
    await this.hashTagRepository.save({ name });
  }
  async verifyHashtagAvailability(name: string): Promise<boolean> {
    const hashtag = await this.hashTagRepository.findOne({
      where: { name: name },
    });
    if (hashtag) return true;
    return false;
  }
  async findHashtagByName(name: string): Promise<HashTagM> {
    return await this.hashTagRepository.findOne({ where: { name } });
  }
}
