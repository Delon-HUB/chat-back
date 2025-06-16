import { Module } from '@nestjs/common';
import { MemberOfGroupService } from './member-of-group.service';

@Module({
  providers: [MemberOfGroupService],
})
export class MemberOfGroupModule {}
