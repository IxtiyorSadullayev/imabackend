import { Module } from '@nestjs/common';
import { YuqlamaService } from './yuqlama.service';
import { YuqlamaController } from './yuqlama.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Yuqlama } from './entities/yuqlama.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Yuqlama]),
  ],
  controllers: [YuqlamaController],
  providers: [YuqlamaService],
})
export class YuqlamaModule {}
