import { Logger, UseFilters, UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from './user.service';
import { WSexceptionFilter } from 'src/ExceptionFilters/WSexception.filter';
import { IResponse } from 'src/Interfaces/IResponse';
import { CreateMessageDto } from 'src/Modules/message/dto/create-message.dto';
import { CreateGroupDto } from '../group/dto/create-group.dto';
import { GroupService } from '../group/group.service';
import { MemberOfGroupService } from '../member-of-group/member-of-group.service';
import { MessageService } from '../message/message.service';
import IConversation from 'src/Interfaces/IConversation';

@WebSocketGateway({ cors: { origin: '*' } })
@UseFilters(WSexceptionFilter)
export class UserGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger: Logger = new Logger();

  private readonly connectedClientList: Map<string, Socket> = new Map<
    string,
    Socket
  >();

  constructor(
    private readonly userService: UserService,
    private readonly groupService: GroupService,
    private readonly memberOfGroupService: MemberOfGroupService,
    private readonly messageService: MessageService,
  ) {}

  afterInit(server: Server) {
    this.logger.log(`${server} websocket initialized succefully✅`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    if (client.handshake.auth.token) {
      this.connectedClientList.set(
        `user_${client.handshake.auth.userId}`,
        client,
      );

      // Join group room
      const groupIds: number[] =
        await this.memberOfGroupService.getGroupIdsOfMember(
          client.handshake.auth.userId,
        );
      groupIds.forEach((id) => {
        client.join(`GRP#${id}`);
      });

      let onlineUsers: number[] = [];
      this.connectedClientList.forEach((val, key) => {
        onlineUsers.push(parseInt(key.replace('user_', '')));
      });
      const response: IResponse = { success: true, data: onlineUsers };
      this.server.to(client.id).emit('onlineUsers', response);
      response.data = client.handshake.auth.userId;
      client.broadcast.emit('newOnlineUser', response);
    }
    this.logger.log(`${client.id} is connected`);
  }

  handleDisconnect(client: Socket) {
    if (client.handshake.auth.token) {
      this.connectedClientList.delete(`user_${client.handshake.auth.userId}`);
      const response: IResponse = {
        success: true,
        data: client.handshake.auth.userId,
      };
      client.broadcast.emit('newOfflineUser', response);
      this.logger.log(`${client.id} is disconnected`);
    }
  }

  @SubscribeMessage('signUp')
  async signUp(client: Socket, payload: any) {
    const newUser = JSON.parse(payload);
    const userCreated = await this.userService.signUp(newUser);
    const response: IResponse = { success: true, data: userCreated };
    this.server.emit('signUp_res', response);
  }

  @SubscribeMessage('signIn')
  async signIn(client: Socket, payload: any) {
    const user = JSON.parse(payload);
    const token = await this.userService.singIn(user);
    const response: IResponse = { success: true, data: token };
    this.server.to(client.id).emit('signIn_res', response);
  }

  @SubscribeMessage('getUsers')
  async getUsers(client: Socket, data: any) {
    const users = await this.userService.getAll();
    const response: IResponse = { success: true, data: users };
    this.server.to(client.id).emit('getUsers_res', response);
  }

  @SubscribeMessage('getUserById')
  async getUserById(client: Socket, data: number) {
    const user = await this.userService.getById(data);
    const response: IResponse = { success: true, data: user };
    this.server.to(client.id).emit('getUserById_res', response);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() message: any,
    @ConnectedSocket() sender: Socket,
  ) {
    const msg: CreateMessageDto = JSON.parse(message);

    const msgSaved: CreateMessageDto = await this.messageService.save(msg);
    const response: IResponse = {
      success: true,
      data: msgSaved,
    };

    if (msgSaved.isgroup) {
      this.server
        .to(`GRP#${msgSaved.receiver_id}`)
        .emit('newMessage', response);
    } else {
      const sendTo = [sender.id];
      const receiverSocket = this.connectedClientList.get(
        `user_${msgSaved.receiver_id}`,
      );
      if (receiverSocket) sendTo.push(receiverSocket.id);
      this.server.to(sendTo).emit('newMessage', response);
    }
  }

  @SubscribeMessage('createGroup')
  async createGroup(
    @MessageBody() data: any,
    @ConnectedSocket() sender: Socket,
  ) {
    const createGroupDto: CreateGroupDto = JSON.parse(data);
    const groupCreated: CreateGroupDto =
      await this.groupService.create(createGroupDto);

    const memberIds: number[] = groupCreated.members.map((member) => member.id);
    memberIds.forEach((id) => {
      this.connectedClientList
        .get(`user_${id}`)
        ?.join(`GRP#${groupCreated.id}`);
    });

    const response: IResponse = {
      success: true,
      data: groupCreated,
    };

    this.server.to(`GRP#${groupCreated.id}`).emit('newGroupCreated', response);
  }

  @SubscribeMessage('getGroupsOfUser')
  async getGroupsOfUser(client: Socket, userId: number) {
    const groups: CreateGroupDto[] =
      await this.groupService.findGroupsOfUser(userId);
    const response: IResponse = { success: true, data: groups };

    this.server.to(client.id).emit('getGroupsOfUser_res', response);
  }

  @SubscribeMessage('getConversations')
  async getConversation(client: Socket, userId: number) {
    const conversations: IConversation[] =
      await this.messageService.getMessageOf(userId);

    const response: IResponse = { success: true, data: conversations };
    this.server.to(client.id).emit('getConversations_res', response);
  }
}
