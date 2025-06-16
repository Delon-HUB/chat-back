import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MemberOfGroupService } from '../member-of-group/member-of-group.service';

@Module({
  providers: [MessageService, MemberOfGroupService],
})
export class MessageModule {}
