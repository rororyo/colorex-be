import { UserM } from "./user";

export class MessageM {
  id:string;
  sender:UserM;
  receiver:UserM;
  content:string;
  createdAt:Date
}
