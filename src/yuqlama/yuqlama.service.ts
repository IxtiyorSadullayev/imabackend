import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateYuqlamaDto } from './dto/create-yuqlama.dto';
import { UpdateYuqlamaDto } from './dto/update-yuqlama.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class YuqlamaService {
  constructor(
    private userService: UsersService
  ){}


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
  async keldiuser(userid: string){
    try{
      const user = await this.userService.findOneUser(userid)
      return user;
    }
    catch(err) {
      throw new HttpException("Serverda hatolik mavjud, "+err , HttpStatus.BAD_REQUEST)
    }
  }
}
