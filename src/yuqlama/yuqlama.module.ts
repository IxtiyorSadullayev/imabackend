import { Module } from '@nestjs/common';
import { YuqlamaService } from './yuqlama.service';
import { YuqlamaController } from './yuqlama.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Yuqlama } from './entities/yuqlama.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Yuqlama]),
    UsersModule
  ],
  controllers: [YuqlamaController],
  providers: [YuqlamaService],
})
export class YuqlamaModule {}
