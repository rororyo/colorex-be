export class User {
  id: string;
  email: string;
  username: string;
  password: string;
  role: Roles;
  created_at: Date;
  subscribed_at: Date;
}

export enum Roles {
  admin = 'admin',
  user = 'user',
  premiumUser = 'premiumUser',
}
