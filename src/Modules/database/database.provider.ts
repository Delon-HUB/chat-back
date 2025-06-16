import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types/sequelize';
import { UserEntity } from '../user/entities/user.entity';
import { GroupEntity } from '../group/entities/group.entity';
import { MemberOfGroupEntity } from '../member-of-group/entities/member-of-group.entity';
import { MessageEntity } from '../message/entities/message.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: process.env.DB_DIALECT as Dialect,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT),
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      });
      sequelize.addModels([UserEntity, GroupEntity, MemberOfGroupEntity, MessageEntity]);
      await sequelize.sync({ force: false });
      return sequelize;
    },
  },
];
