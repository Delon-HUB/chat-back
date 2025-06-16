import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  DefaultScope,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CreateGroupDto as CreateGroupDto } from '../dto/create-group.dto';
import { CreateUserDto } from 'src/Modules/user/dto/create-user.dto';
import { UserEntity } from 'src/Modules/user/entities/user.entity';
import { MemberOfGroupEntity } from 'src/Modules/member-of-group/entities/member-of-group.entity';

@DefaultScope(() => ({ raw: true, nest: true }))
@Table({ timestamps: false, tableName: 'Group' })
export class GroupEntity
  extends Model<CreateGroupDto>
  implements CreateGroupDto
{
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column
  name: string;

  @ForeignKey(() => UserEntity)
  @AllowNull(false)
  @Column
  owner_id: number;

  @AllowNull(false)
  @Column
  created_at: number;

  @AllowNull(false)
  @Column
  updated_at: number;

  @BelongsToMany(() => UserEntity, () => MemberOfGroupEntity)
  members: CreateUserDto[];

  @BelongsTo(() => UserEntity, 'owner_id')
  owner: CreateUserDto;
}
