
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { SignUpInput } from '../tools/signup.input';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private chatService: ChatService) {
    super();
  }

  async validate(credentials: SignUpInput): Promise<{ access_token: string, name: string, id: string }> {
    const user = await this.chatService.postDataLogin(credentials);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
