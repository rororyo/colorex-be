import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Auth{
  @PrimaryColumn()
  token: string
}