import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateYuqlamaDto } from './dto/create-yuqlama.dto';
import { UpdateYuqlamaDto } from './dto/update-yuqlama.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Yuqlama } from './entities/yuqlama.entity';

@Injectable()
export class YuqlamaService {
  constructor(
    private userService: UsersService,
    @InjectRepository(Yuqlama) private yuqlamaRepo: Repository<Yuqlama>
  ){}


  create(createYuqlamaDto: CreateYuqlamaDto) {
    return 'This action adds a new yuqlama';
  }

  async findAll() {
    return await this.yuqlamaRepo.find()
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
  async keldiuser(userid: CreateYuqlamaDto){
    try{
      const user = await this.userService.findOneUser(userid.userid)
      if(!user) {
        throw new HttpException("Foydalanuvchi topilmadi", HttpStatus.NOT_FOUND);
      }
      const yuqlamabugun = await this.yuqlamaRepo.find({
        where: {
          user: { id: user.id }, 
        }
      });
      console.log(new Date().toISOString().split("T")[0]);
      if(yuqlamabugun.filter(y => y.createdAt.toISOString().split("T")[0] === new Date().toISOString().split("T")[0]).length > 0 ) {
        throw new HttpException("Foydalanuvchi bugun keldi", HttpStatus.BAD_REQUEST);
      }
      const yuqlama = new Yuqlama();
      yuqlama.user = user;
      yuqlama.come = new Date().toString().split("T")[0];
      yuqlama.createdAt = new Date();
      yuqlama.updatedAt = new Date();
      await this.yuqlamaRepo.save(yuqlama);
      return user;
    }
    catch(err) {
      throw new HttpException("Serverda hatolik mavjud, "+err , HttpStatus.BAD_REQUEST)
    }
  }
}
