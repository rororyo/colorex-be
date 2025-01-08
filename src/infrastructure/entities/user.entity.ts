
import { Roles } from 'src/domains/model/roles.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') // Using UUID for id (common practice)
  id: string;

  @Column({ unique: true }) // Email should be unique
  email: string;

  @Column({ unique: true }) // Username should also be unique
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum', // Map to the enum type in the database
    enum: Roles,
    default: Roles.user, // Default role is 'user'
  })
  role: Roles;

  @Column({
    type: 'timestamp', // Explicitly define type for timestamps
    default: () => 'CURRENT_TIMESTAMP', // Use SQL's current timestamp function
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    nullable: true, // Allow nulls if user hasn't subscribed yet
  })
  subscribed_at: Date;
}
