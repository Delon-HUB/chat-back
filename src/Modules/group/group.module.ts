import { Module } from '@nestjs/common';
import { GroupService as GroupService } from './group.service';
import { MemberOfGroupModule } from '../member-of-group/member-of-group.module';
import { MemberOfGroupService } from '../member-of-group/member-of-group.service';

@Module({
  imports: [MemberOfGroupModule],
  providers: [GroupService, MemberOfGroupService],
})
export class GroupModule {}
