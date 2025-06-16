import { CreateGroupDto } from 'src/Modules/group/dto/create-group.dto';
import { CreateUserDto } from 'src/Modules/user/dto/create-user.dto';

export interface CreateMemberOfGroupDto {
  user_id: number;
  group_id: number;
  created_at: number;
  user?: CreateUserDto;
  group?: CreateGroupDto;
}
