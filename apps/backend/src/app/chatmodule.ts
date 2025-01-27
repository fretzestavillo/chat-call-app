import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GatewayModule } from './gateway/gateway.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './tools/user.entity';
import { ChatEntity } from './tools/chat.entity';
import { PrivateEntity } from './tools/private.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constant';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ChatEntity, PrivateEntity]), GatewayModule,
  //  JwtModule.register({global: true, secret: jwtConstants.secret, signOptions: {expiresIn: '200s'}, })],
   JwtModule.register({global: true, secret: jwtConstants.secret, signOptions: {}, })],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule {}
