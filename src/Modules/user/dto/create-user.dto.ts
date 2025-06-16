import { CreateGroupDto } from 'src/Modules/group/dto/create-group.dto';

export interface CreateUserDto {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: number;
  groups?: CreateGroupDto[];
  owner?: CreateUserDto;
}
