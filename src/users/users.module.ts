import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserType } from './entities/usertype.entity';
import { ClassName } from './entities/className.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserType, ClassName])
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
