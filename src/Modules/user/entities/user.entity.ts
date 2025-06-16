import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  DefaultScope,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateGroupDto } from 'src/Modules/group/dto/create-group.dto';
import { GroupEntity } from 'src/Modules/group/entities/group.entity';
import { MemberOfGroupEntity } from 'src/Modules/member-of-group/entities/member-of-group.entity';

@DefaultScope(() => ({ attributes: { exclude: ['password'] }, raw: true, nest: true }))
@Scopes(() => ({
  login: {
    attributes: ['id', 'email', 'password'],
  },
}))
@Table({ timestamps: false, tableName: 'User' })
export class UserEntity extends Model<CreateUserDto> implements CreateUserDto {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column
  username: string;

  @AllowNull(false)
  @Column
  email: string;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(false)
  @Column
  created_at: number;

  @BelongsToMany(() => GroupEntity, () => MemberOfGroupEntity)
  groups: CreateGroupDto[];
}
