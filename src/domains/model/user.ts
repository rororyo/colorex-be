import { Roles } from "./roles.enum";

export class UserM {
  id: string;
  email: string;
  username: string;
  password: string;
  role: Roles;
  created_at: Date;
  subscribed_at: Date;
}
