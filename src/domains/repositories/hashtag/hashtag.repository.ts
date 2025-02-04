import { HashTagM } from "src/domains/model/hashtag";
import { PostM } from "src/domains/model/post";

export interface  HashTagRepository{
  createHashtag(name: string): Promise<void>;
  verifyHashtagAvailability(name: string): Promise<boolean>;
  findHashtagByName(name: string): Promise<HashTagM> 
  getPopularHashtags(): Promise<Partial<PostM>[]>
}