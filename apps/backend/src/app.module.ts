import { Module } from '@nestjs/common';
import { ChatModule } from './app/chatmodule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './app/tools/user.entity';
import { ChatEntity } from './app/tools/chat.entity';
import { PrivateEntity } from './app/tools/private.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: 'host.docker.internal',  // Updated host for WSL2
      host: '172.19.16.1',
      port: 5432,
      username: 'file',
      password: 'file',
      database: 'file',
      entities: [UserEntity, ChatEntity, PrivateEntity],
      synchronize: true,
    }),

    ChatModule,
  ],
})
export class MainModule {}
