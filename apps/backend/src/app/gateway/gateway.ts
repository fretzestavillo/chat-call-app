import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  CreatePrivateMessage,
  Inputs,
  Item,
  PrivateCaller,
} from '../tools/type';
import { Inject, Logger } from '@nestjs/common';
import { ChatService } from '../chat.service';

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class MyGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @Inject()
  private chatService: ChatService;
  private logger: Logger = new Logger('MyGateway');
  private count = 0;
  private userSockets: Map<string, string> = new Map();
  public onlineUsers: Item[] = [];

  @WebSocketServer()
  private server: Server;

  afterInit(server: Socket) {
    this.logger.log(` 🚀 MyGateway is running on: http://localhost:3002`);
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    this.count += 1;
    this.logger.log(`Connected: ${this.count} connection connect}`);
  }

  async handleDisconnect(client: Socket) {
    this.count -= 1;
    this.logger.log(`Connected: ${this.count} connection disconnect`);

    this.onlineUsers = this.onlineUsers.filter(
      (user: Item) => user.socketId !== client.id
    );
    this.server.emit('activeUsers', this.onlineUsers);
  }

  @SubscribeMessage('register_user')
  async registerOnlineUser(client: Socket, username: string) {
    const data: Item = {
      socketId: client.id,
      name: username,
    };
    this.onlineUsers.push(data);

    const getAllUsers = await this.chatService.getAllUsers();
    this.server.emit('getAllUsers', getAllUsers);
    this.userSockets.set(username, client.id);

    this.server.emit('activeUsers', this.onlineUsers);
  }

  @SubscribeMessage('messageToServer')
  async GroupChat(client: Socket, data: Inputs) {
    const createdmessages = await this.chatService.createMessage(data);
    this.server.emit('messageToClient', createdmessages);
  }

  @SubscribeMessage('private_chat')
  async privateMessages(client: Socket, data: CreatePrivateMessage) {
    const privateMessages = await this.chatService.createPrivateMessage(data);
    const recipientSocketId = this.userSockets.get(privateMessages.recipient);
    this.server.to(recipientSocketId).emit('private_message', privateMessages);
    client.emit('private_message', privateMessages);
  }

  @SubscribeMessage('private_call_id')
  async privateCallId(client: Socket, data: PrivateCaller) {
    const recipientSocketId = this.userSockets.get(data.recipient);
    this.server.to(recipientSocketId).emit('private_caller_id', data);
    client.emit('private_caller_id', data);

    this.logger.log(
      'I am here',
      data.callId,
      data.sender,
      data.recipient,
      'here =>',
      recipientSocketId
    );
  }
}
