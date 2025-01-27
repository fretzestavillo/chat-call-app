import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  sender: string;

  @Column()
  message: string;

  @CreateDateColumn()
  created_at: Date;
}
