import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { YuqlamaService } from './yuqlama.service';
import { CreateYuqlamaDto } from './dto/create-yuqlama.dto';
import { UsersGuard } from 'src/users/users.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('yuqlama')
export class YuqlamaController {
  constructor(private readonly yuqlamaService: YuqlamaService) { }

  @ApiBearerAuth()
  @UseGuards(UsersGuard)
  @Get('sana')
  findbydate(@Query('sana') sana: string) {
    // sana bo'yicha ma'lumotlarni qidirib topish
    return this.yuqlamaService.findSana(sana)
  }

  @Get('bugun')
  findAllBugun() {
    return this.yuqlamaService.findAllBugun();
  }

  @ApiBearerAuth()
  @UseGuards(UsersGuard)
  @Get()
  findAll() {
    return this.yuqlamaService.findAll();
  }


  @ApiBearerAuth()
  @UseGuards(UsersGuard)
  @Post('user')
  keldiuser(@Body() userid: CreateYuqlamaDto) {
    return this.yuqlamaService.keldiuser(userid);
  }
}
