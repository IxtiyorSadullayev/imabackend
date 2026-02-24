import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateYuqlamaDto } from './dto/create-yuqlama.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Yuqlama } from './entities/yuqlama.entity';

@Injectable()
export class YuqlamaService {
  constructor(
    private userService: UsersService,
    @InjectRepository(Yuqlama) private yuqlamaRepo: Repository<Yuqlama>
    ) { }



  async findAll() {
    return await this.yuqlamaRepo.find({ relations: { user: { className: true } } })
  }

  async keldiuser(userid: CreateYuqlamaDto) {
    try {
      const user = await this.userService.findOneUser(userid.userid)
      if (!user) {
        throw new HttpException("Foydalanuvchi topilmadi", HttpStatus.NOT_FOUND);
      }
      const yuqlamabugun = await this.yuqlamaRepo.find({
        where: {
          user: { id: user.id },
        }
      });
      console.log(new Date().toISOString().split("T")[0]);
      if (yuqlamabugun.filter(y => y.createdAt.toISOString().split("T")[0] === new Date().toISOString().split("T")[0]).length > 0) {
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
    catch (err) {
      throw new HttpException("Serverda hatolik mavjud, " + err, HttpStatus.BAD_REQUEST)
    }
  }

  async findSana(sana: string) {
    try {
      // bu yerga sanani quyidagi formatda berishi kerak bo'ladi
      // 2026-01-28
      const yuqlamalar = await this.yuqlamaRepo.createQueryBuilder("yuqlama")
        .where("yuqlama.createdAt like :sana", { sana: `%${sana}%` })
        .select([
          "yuqlama.id",
          "yuqlama.come",
          "yuqlama.createdAt",
          "user.fullname",
          "className.classname"
        ])
        .leftJoin("yuqlama.user", "user")
        .leftJoin("user.className", "className")
        .getMany()
      return yuqlamalar;
    } catch (err) {
      throw new HttpException("Serverda hatolik mavjud: " + err, HttpStatus.BAD_REQUEST);
    }
  }

  async findSanaKelmaganlar(sana: string) {
    try {
      const kelmaganUsers = await this.userService.findAllUserKelmaganlar(sana)
      return kelmaganUsers;
    }
    catch (err) {
      throw new HttpException("Serverda hatolik mavjud: " + err, HttpStatus.BAD_REQUEST);
    }
  }

  async findAllBugun() {
    try {
      const today = new Date().toISOString().split("T")[0];
      const yuqlamalar = await this.yuqlamaRepo.createQueryBuilder("yuqlama")
        .where("yuqlama.createdAt like :today", { today: `%${today}%` })
        .select([
          "yuqlama.id",
          "yuqlama.come",
          "yuqlama.createdAt",
          "user.fullname",
          "className.classname"
        ])
        .leftJoin("yuqlama.user", "user")
        .leftJoin("user.className", "className")
        .getMany()
      return yuqlamalar;
    } catch (err) {
      throw new HttpException("Serverda hatolik mavjud: " + err, HttpStatus.BAD_REQUEST);
    }
  }

  async findSanaKelmaganlar(sana: string) {
    try {
      const kelmaganUsers = await this.userService.findAllUserKelmaganlar(sana)
      return kelmaganUsers;
    }
    catch (err) {
      throw new HttpException("Serverda hatolik mavjud: " + err, HttpStatus.BAD_REQUEST);
    }
  }

}
