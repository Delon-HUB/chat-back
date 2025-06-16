import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UserEntity } from 'src/Modules/user/entities/user.entity';

@DefaultScope(() => ({ raw: true, nest: true }))
@Table({ timestamps: false, tableName: 'Message' })
export class MessageEntity
  extends Model<CreateMessageDto>
  implements CreateMessageDto
{
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @ForeignKey(() => UserEntity)
  @AllowNull(false)
  @Column
  sender_id: number;

  @AllowNull(false)
  @Column
  receiver_id: number;

  @AllowNull(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isgroup: boolean;

  @AllowNull(false)
  @Column(DataType.TEXT)
  content: string;

  @AllowNull(false)
  @Column
  created_at: number;
}
