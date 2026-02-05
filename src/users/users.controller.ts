import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Query } from '@nestjs/common';
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
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UpdateLoginAndPasswordDto } from './dto/updateLogin.dto';
import { CreateUserByFileDto } from './dto/createUserByFile.dto';
import { UpdateUserClassnameDto } from './dto/updateClassName.dto';

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
  @Get('type/:id')
  getOneUsertype(@Param("id") id:string) {
    return this.usersService.findOneusertype(id);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Patch('type/:id')
  updateusertype(@Param('id') id: string, @Body() updateDto: CreateUserTypeDto) {
    return this.usersService.updateUser(id, updateDto);
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

  @Get('bugun')
  getBuguntugilganlar() {
    return this.usersService.bugun()
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('getbyUserType')
  getByUserType(@Query('usertype_id') usertype_id: string) {
    return this.usersService.getByUserType(usertype_id)
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Post('byfilexlsx')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        class_name: { type: 'string' },
        user_type: { type: 'string' },
        xls: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('xls', {
    storage: diskStorage({
      destination: "./xls",
      filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0];
        const fileExtname = extname(file.originalname);
        const randomName = `${name}-${Date.now()}${fileExtname}`;
        callback(null, randomName);
      },
    })
  }))
  createUserByFile(@Body() createUserByFileDto: CreateUserByFileDto, @UploadedFile() xls: Express.Multer.File) {
    return this.usersService.createUserByFile(createUserByFileDto, xls)
 }
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Get('getcheck')
  getcheck(){
    return this.usersService.checkCondidate()
  }

  @Get("getbirthdays")
  getBirthdays(){
    return this.usersService.getBugunBirthday()
  }


  // update user classname
  @ApiBearerAuth()
  @UseGuards(UsersGuard)
  @Patch('userclassname/:id')
  updateUserClassname(@Param('id') id: string, @Body() updateUserClassnameDto: UpdateUserClassnameDto) {
    return this.usersService.updateClassNameUser(id, updateUserClassnameDto);
  }


  @ApiBearerAuth()
  @UseGuards(UsersGuard)
  @Patch('setloginpassword')
  setLoginAndPassword() {
    return this.usersService.setloginandpassword();
  }

  @ApiBearerAuth()
  @UseGuards(UsersGuard)
  @Patch('userphoto/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
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
  updateUserPhoto(@Param('id') id: string, @UploadedFile() photo: Express.Multer.File) {
    return this.usersService.updateUserPhoto(id, photo);
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
  findOneandupdateloginpassword(@Param('id') id: string, @Body() updateloginandpassworddto: UpdateLoginAndPasswordDto) {
    return this.usersService.findOneUserAndUpdateLoginAndPassword(id, updateloginandpassworddto);
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  

}
