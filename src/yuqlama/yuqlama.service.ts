import { Injectable } from '@nestjs/common';
import { CreateYuqlamaDto } from './dto/create-yuqlama.dto';
import { UpdateYuqlamaDto } from './dto/update-yuqlama.dto';

@Injectable()
export class YuqlamaService {
  create(createYuqlamaDto: CreateYuqlamaDto) {
    return 'This action adds a new yuqlama';
  }

  findAll() {
    return `This action returns all yuqlama`;
  }

  findOne(id: number) {
    return `This action returns a #${id} yuqlama`;
  }

  update(id: number, updateYuqlamaDto: UpdateYuqlamaDto) {
    return `This action updates a #${id} yuqlama`;
  }

  remove(id: number) {
    return `This action removes a #${id} yuqlama`;
  }
}
