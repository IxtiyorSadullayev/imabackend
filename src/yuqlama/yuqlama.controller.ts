import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { YuqlamaService } from './yuqlama.service';
import { CreateYuqlamaDto } from './dto/create-yuqlama.dto';
import { UpdateYuqlamaDto } from './dto/update-yuqlama.dto';

@Controller('yuqlama')
export class YuqlamaController {
  constructor(private readonly yuqlamaService: YuqlamaService) {}

  @Post()
  create(@Body() createYuqlamaDto: CreateYuqlamaDto) {
    return this.yuqlamaService.create(createYuqlamaDto);
  }

  @Get()
  findAll() {
    return this.yuqlamaService.findAll();
  }

  @Post('user')
  keldiuser(@Body() userid: CreateYuqlamaDto) {
    return this.yuqlamaService.keldiuser(userid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.yuqlamaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateYuqlamaDto: UpdateYuqlamaDto) {
    return this.yuqlamaService.update(+id, updateYuqlamaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.yuqlamaService.remove(+id);
  }
}
