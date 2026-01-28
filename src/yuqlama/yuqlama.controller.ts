import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { YuqlamaService } from './yuqlama.service';
import { CreateYuqlamaDto } from './dto/create-yuqlama.dto';

@Controller('yuqlama')
export class YuqlamaController {
  constructor(private readonly yuqlamaService: YuqlamaService) {}

  @Get('sana')
  findbydate(@Query('sana') sana: string){
    // sana bo'yicha ma'lumotlarni qidirib topish
    return this.yuqlamaService.findSana(sana)
  }

  @Get()
  findAll(@Query('come') come: string) {
    return this.yuqlamaService.findAll(come);
  }


  @Post('user')
  keldiuser(@Body() userid: CreateYuqlamaDto) {
    return this.yuqlamaService.keldiuser(userid);
  }
}
