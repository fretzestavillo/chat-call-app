import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { ChatService } from '../chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../tools/user.entity';
import { ChatEntity } from '../tools/chat.entity';
import { PrivateEntity } from '../tools/private.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ChatEntity, PrivateEntity])],
  providers: [MyGateway, ChatService],
})
export class GatewayModule {}
