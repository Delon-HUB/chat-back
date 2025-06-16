import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberOfGroupDto } from './dto/create-member-of-group.dto';
import { MemberOfGroupEntity } from './entities/member-of-group.entity';
import { EAPI_SEARCH_ERROR } from 'src/Enums/apiError';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class MemberOfGroupService {
  async create(
    createMemberOfGroupDto: CreateMemberOfGroupDto,
  ): Promise<CreateMemberOfGroupDto> {
    createMemberOfGroupDto.created_at = Date.now() / 1000;
    return (await MemberOfGroupEntity.create(
      createMemberOfGroupDto,
    )) as CreateMemberOfGroupDto;
  }

  async getMemberOf(group_id): Promise<CreateMemberOfGroupDto[]> {
    const members: CreateMemberOfGroupDto[] = await MemberOfGroupEntity.findAll(
      {
        where: { group_id: group_id },
        include: [UserEntity],
      },
    );

    if (!members) throw new NotFoundException(EAPI_SEARCH_ERROR.NOT_FOUND);
    return members as CreateMemberOfGroupDto[];
  }

  async getGroupIdsOfMember(member_id: number): Promise<number[]> {
    const groups: CreateMemberOfGroupDto[] = await MemberOfGroupEntity.findAll({
      where: { user_id: member_id },
    });

    return groups.map((m) => m.group_id);
  }
}
