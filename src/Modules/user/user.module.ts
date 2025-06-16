import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { UserGateway } from './user.gateway';
import { GroupModule } from '../group/group.module';
import { GroupService } from '../group/group.service';
import { MemberOfGroupService } from '../member-of-group/member-of-group.service';
import { MessageService } from '../message/message.service';

@Module({
  imports: [GroupModule],
  providers: [
    UserService,
    JwtService,
    UserGateway,
    GroupService,
    MemberOfGroupService,
    MessageService,
  ],
})
export class UserModule {}
