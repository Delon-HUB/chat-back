import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupEntity } from './entities/group.entity';
import { EAPI_SEARCH_ERROR } from 'src/Enums/apiError';
import { MemberOfGroupService } from '../member-of-group/member-of-group.service';
import { CreateMemberOfGroupDto } from '../member-of-group/dto/create-member-of-group.dto';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class GroupService {
  constructor(private readonly memberOfGroupService: MemberOfGroupService) {}
  async create(createGroupDto: CreateGroupDto): Promise<CreateGroupDto> {
    createGroupDto.created_at = Date.now() / 1000;

    const groupCreated: CreateGroupDto =
      await GroupEntity.create(createGroupDto);

    createGroupDto.members.forEach(async (member) => {
      let tmp: CreateMemberOfGroupDto = {
        user_id: member.id,
        group_id: groupCreated.id,
        created_at: Date.now() / 1000,
      };
      await this.memberOfGroupService.create(tmp);
    });

    return (await this.findById(groupCreated.id)) as CreateGroupDto;
  }

  async findById(groupId: number): Promise<CreateGroupDto> {
    const group: CreateGroupDto = await GroupEntity.findByPk(groupId, {
      include: [{ model: UserEntity, as: 'owner' }],
    });

    if (!group) throw new NotFoundException(EAPI_SEARCH_ERROR.NOT_FOUND);

    const members: CreateMemberOfGroupDto[] =
      await this.memberOfGroupService.getMemberOf(group.id);

    group.members = members.map((member) => member.user);
    group.members.push(group.owner);

    return group as CreateGroupDto;
  }

  async findGroupsOfUser(userId: number): Promise<CreateGroupDto[]> {
    const groupIds: number[] =
      await this.memberOfGroupService.getGroupIdsOfMember(userId);

    const groups: CreateGroupDto[] = await Promise.all(
      groupIds.map(async (id) => {
        return (await this.findById(id)) as CreateGroupDto;
      }),
    );

    return groups?.length ? groups : [];
  }

  async findAll(): Promise<CreateGroupDto[]> {
    const groups = await GroupEntity.findAll();
    if (groups.length <= 0)
      throw new NotFoundException(EAPI_SEARCH_ERROR.NOT_FOUND);
    return groups as CreateGroupDto[];
  }
}
