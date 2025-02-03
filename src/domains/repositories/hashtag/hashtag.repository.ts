import { HashTagM } from "src/domains/model/hashtag";

export interface  HashTagRepository{
  createHashtag(name: string): Promise<void>;
  verifyHashtagAvailability(name: string): Promise<boolean>;
  findHashtagByName(name: string): Promise<HashTagM> 
}