import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class PrivateEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  sender: string;

  @Column()
  recipient: string;

  @Column()
  messageContent: string;


  @CreateDateColumn()
  created_at: Date;
}
