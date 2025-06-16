import {
  AllowNull,
  BelongsTo,
  Column,
  DefaultScope,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { CreateMemberOfGroupDto } from '../dto/create-member-of-group.dto';
import { UserEntity } from 'src/Modules/user/entities/user.entity';
import { GroupEntity } from 'src/Modules/group/entities/group.entity';
import { CreateUserDto } from 'src/Modules/user/dto/create-user.dto';
import { CreateGroupDto } from 'src/Modules/group/dto/create-group.dto';

@DefaultScope(() => ({ raw: true, nest: true }))
@Table({ timestamps: false, tableName: 'MemberOfGroup' })
export class MemberOfGroupEntity
  extends Model<CreateMemberOfGroupDto>
  implements CreateMemberOfGroupDto
{
  @ForeignKey(() => UserEntity)
  @AllowNull(false)
  @Column
  user_id: number;

  @ForeignKey(() => GroupEntity)
  @AllowNull(false)
  @Column
  group_id: number;

  @AllowNull(false)
  @Column
  created_at: number;

  @BelongsTo(() => UserEntity)
  user: CreateUserDto;

  @BelongsTo(() => GroupEntity)
  group: CreateGroupDto;
}
