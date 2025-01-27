import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SignUpInput } from './tools/signup.input';
import { UserEntity } from './tools/user.entity';
import { ChatEntity } from './tools/chat.entity';
import { PrivateEntity } from './tools/private.entity';
import { AuthGuard } from './auth/guard';

@Controller()

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('signup')
  postDataSignUp(@Body() userInput: SignUpInput): Promise<UserEntity> {
    return this.chatService.postDataSignUp(userInput);
  }


  
  @Post('login')
  postDataLogin(@Body() userInput: SignUpInput): Promise<{ access_token: string, name: string, id: string }>{
    return this.chatService.postDataLogin(userInput);
  }

  @Get('chat')
  @UseGuards(AuthGuard)
  getData(): Promise<ChatEntity[]> {
    return this.chatService.getAllMessages();
  }


  
  @Get('privatechat')
  @UseGuards(AuthGuard)
  getPrivateMessages(@Query('sender') sender: string,
  @Query('recipient') recipient: string)
  
  : Promise<PrivateEntity[]> {
   
    return this.chatService.getPrivateMessages(sender, recipient);
  }


  @Get('users')
  getAllUsers(): Promise<UserEntity[]>{

    return this.chatService.getAllUsers();


  }
}
