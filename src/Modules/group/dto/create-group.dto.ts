import { CreateUserDto } from 'src/Modules/user/dto/create-user.dto';

export interface CreateGroupDto {
  id: number;
  name: string;
  owner_id: number;
  created_at: number;
  updated_at: number;
  owner: CreateUserDto;
  members: CreateUserDto[];
}
