import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateYuqlamaDto } from './dto/create-yuqlama.dto';
import { UpdateYuqlamaDto } from './dto/update-yuqlama.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Yuqlama } from './entities/yuqlama.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class YuqlamaService {
  constructor(
    @InjectRepository(Yuqlama) private yuqlamaRepo: Repository<Yuqlama>,
    private readonly usersService: UsersService,
  ) { }
  async create(createYuqlamaDto: CreateYuqlamaDto) {
    try {
      const user = await this.usersService.findOneUser(createYuqlamaDto.userid);
      const condidate = await this.yuqlamaRepo.find({ where: { user: { id: createYuqlamaDto.userid }, come: createYuqlamaDto.come } })
      if (condidate.length !== 0) {
        throw new HttpException("Kechirasiz ushbu foydalanuvchi bugun maktabga allaqachon kelgan", HttpStatus.BAD_REQUEST)
      }
      const newyoqlama = this.yuqlamaRepo.create({
        user: user,
        come: createYuqlamaDto.come
      })
      await this.yuqlamaRepo.save(newyoqlama)

      return newyoqlama;
    }
    catch (err) {
      throw new HttpException("Serverda hatolik, " + err, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll(come: string) {
    try {
      const yuqlamalar = await this.yuqlamaRepo.createQueryBuilder("yuqlama")
        .leftJoinAndSelect("yuqlama.user", "user")
        .leftJoinAndSelect("user.className", "className")
        .select([
          "yuqlama.id",
          "yuqlama.come",
          "yuqlama.createdAt",])
        .addSelect("user.fullname", "user_fullname")
        .addSelect("className.classname", "class_classname")
        .where("yuqlama.come = :come", { come: come })
        .getRawMany();
      return yuqlamalar;
    }
    catch (err) {
      throw new HttpException("Serverda hatolik, " + err, HttpStatus.BAD_REQUEST)
    }
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
