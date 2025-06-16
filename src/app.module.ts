import { Module } from '@nestjs/common';
import { UserModule } from './Modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './Modules/database/database.module';
import { MessageModule } from './Modules/message/message.module';
import { GroupModule } from './Modules/group/group.module';
import { MemberOfGroupModule } from './Modules/member-of-group/member-of-group.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    DatabaseModule,
    MessageModule,
    GroupModule,
    MemberOfGroupModule,
  ],
})
export class AppModule {}
