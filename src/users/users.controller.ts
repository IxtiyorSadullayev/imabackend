import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserTypeDto } from './dto/create-usertype.dto';
import { CreateClassNameDto } from './dto/create-classname.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { LoginDto } from './dto/login.dto';
import { AdminGuard } from './admin.guard';
import { UsersGuard } from './users.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateLoginAndPasswordDto } from './dto/updateLogin.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Post('type')
  createusertype(@Body() usertypedto: CreateUserTypeDto) {
    return this.usersService.createuserType(usertypedto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('type')
  getAllUsertype() {
    return this.usersService.findallusertype();
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete('type/:id')
  deleteusertype(@Param('id') id: string) {
    return this.usersService.delusertype(id);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('classname')
  createclassname(@Body() createclassnamedto: CreateClassNameDto) {
    return this.usersService.createClassname(createclassnamedto)
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('classname')
  getAllClassname() {
    return this.usersService.getAllClassName()
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('classname/:id')
  getOneClassname(@Param("id") id: string) {
    return this.usersService.getOneClassName(id)
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch('classname/:id')
  updateoneClassname(@Param("id") id: string, @Body() createclasnameDto: CreateClassNameDto) {
    return this.usersService.updateOneClassName(id, createclasnameDto)
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete('classname/:id')
  deleteoneClassname(@Param("id") id: string) {
    return this.usersService.deleteOneClassName(id)
  }

  @Post('login')
  loginUser(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto)
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('getcheck')
  getcheck(){
    return this.usersService.checkCondidate()
  }

  @Get("getbirthdays")
  getBirthdays(){
    return this.getBirthdays()
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: "./uploads",
      filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0];
        const fileExtname = extname(file.originalname);
        const randomName = `${name}-${Date.now()}${fileExtname}`;
        callback(null, randomName);
      },
    })
  }))
  create(@Body() createUserDto: CreateUserDto, @UploadedFile() photo: Express.Multer.File) {
    return this.usersService.create(createUserDto, photo);
  }


  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(UsersGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
  }

  @ApiBearerAuth()
  @UseGuards(UsersGuard)
  @Patch(':id')
  findOneandupdateloginpassword(@Param('id') id: string, @Body()updateloginandpassworddto: UpdateLoginAndPasswordDto) {
    return this.usersService.findOneUserAndUpdateLoginAndPassword(id, updateloginandpassworddto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  

}
