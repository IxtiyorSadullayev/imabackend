import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserType } from './entities/usertype.entity';
import { ClassName } from './entities/className.entity';
import { CreateUserTypeDto } from './dto/create-usertype.dto';
import { CreateClassNameDto } from './dto/create-classname.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateLoginAndPasswordDto } from './dto/updateLogin.dto';
import { rm } from 'fs';
import { Workbook } from 'exceljs'
import { CreateUserByFileDto } from './dto/createUserByFile.dto';
import { UpdateUserClassnameDto } from './dto/updateClassName.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserType) private userTypeRepo: Repository<UserType>,
    @InjectRepository(ClassName) private classNameRepo: Repository<ClassName>,
    private jwtService: JwtService
  ) { }

  async createuserType(usertypecreate: CreateUserTypeDto) {
    try {
      const usertype = await this.userTypeRepo.findOne({ where: { role: usertypecreate.role } })
      if (usertype) {
        throw new HttpException("Kechirasiz ushbu userning turi oldin yaratilgan", HttpStatus.BAD_REQUEST);
      }
      const usertypenew = this.userTypeRepo.create(usertypecreate)

      await this.userTypeRepo.save(usertypenew)
      return usertypenew
    }
    catch (err) {
      throw new HttpException("User Type ni kiritishda muammoga duch kelindi\n" + err, HttpStatus.BAD_REQUEST)
    }
  }
  
  // async findAllUserKelmaganlar(sana: string){
  //   try {
  //     const kelmaganUsers = await this.userRepo
  //       .createQueryBuilder("user")
  //       .leftJoin(
  //         "user.yuqlamalar",
  //         "yuqlama",
  //         "yuqlama.createdAt LIKE :sana",
  //         { sana: `%${sana}%` }
  //       )
  //       .where("yuqlama.id IS NULL")
  //       .select([
  //         "user.id",
  //         "user.fullname",
  //         "className.classname"
  //       ])
  //       .leftJoin("user.className", "className")
  //       .getMany();
      
  //     return kelmaganUsers;
  //   } catch (err) {
  //     throw new HttpException("Barcha userlarni olishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
  //   }
  // }

  async findOneUserTypeById(id: string) {
    try {
      const usertype = await this.userTypeRepo.findOne({ where: { id: id } })
      if (!usertype) {
        throw new HttpException("Kechirasiz ushbu foydalanuvchi turi topilmadi.", HttpStatus.NOT_FOUND)
      }
      return usertype
    }
    catch (err) {
      throw new HttpException("User Type larni olishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }

  async findallusertype() {
    try {
      const usertypes = await this.userTypeRepo.find()
      return usertypes
    }
    catch (err) {
      throw new HttpException("Barcha usertype larni olishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }

  async findOneusertype(id: string){
    try {
      const usertypes = await this.userTypeRepo.findOne({where: {id: id}})
      if (!usertypes){
        throw new HttpException("Kechirasiz ma'lumot topilmadi", HttpStatus.NOT_FOUND);
      }
      return usertypes
    }
    catch (err) {
      throw new HttpException("Usertypeni olishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }

  async updateUser(id: string, updateDto: CreateUserTypeDto){
    try {
      const usertype = await this.userTypeRepo.findOne({ where: { id: id } })
      if (!usertype) {
        throw new HttpException("Kechirasiz ushbu user turi mavjud emas!", HttpStatus.NOT_FOUND);
      }
      await this.userTypeRepo.update(id, updateDto)
      return "Ma'lumot yangilandi"
    }
    catch (err) {
      throw new HttpException("usertype ni o'chirishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }
  async delusertype(id: string) {
    try {
      const usertype = await this.userTypeRepo.findOne({ where: { id: id } })
      if (!usertype) {
        throw new HttpException("Kechirasiz ushbu user turi mavjud emas!", HttpStatus.NOT_FOUND);
      }
      await this.userTypeRepo.delete(id)
      return "Ushbu userning turi o'chirildi. Muammo hal qilindi."
    }
    catch (err) {
      throw new HttpException("usertype ni o'chirishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }


  async create(createUserDto: CreateUserDto, photo) {
    try {
      const user = await this.userRepo.findOne({ where: { fullname: createUserDto.fullname } })
      if (user) {
        throw new HttpException("Kechirasiz ushbu foydalanuvchi oldin yaratilgan!", HttpStatus.BAD_REQUEST)
      }
      const usertype = await this.userTypeRepo.findOne({ where: { id: createUserDto.userType } })
      const classname = await this.classNameRepo.findOne({ where: { id: createUserDto.className } })
      const newuser = this.userRepo.create({
        login: createUserDto.login == "" ? "" : createUserDto.login,
        password: createUserDto.password == "" ? "" : createUserDto.password,
        pas_seria: createUserDto.pas_seria,
        pas_number: createUserDto.pas_number,
        fullname: createUserDto.fullname,
        birthday: createUserDto.birthday,
        phoneNumber: createUserDto.phoneNumber,
        userType: usertype,
        className: classname,
        imgUrl: photo ? photo.path : ""
      })
      await this.userRepo.save(newuser)
      return newuser;
    }
    catch (err) {
      throw new HttpException("Yangi user yaratishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }

  async findAll() {
    try {
      const users = await this.userRepo.find({select: {id: true, fullname: true, jinsi: true, userType: {role: true}, className: {classname: true}}, relations: {userType: true, className: true}})
      const classess = await this.classNameRepo.find()

      var data =[] 
      classess.forEach(cl =>{
        var sinf_users = []
        users.forEach(user => {
          if(cl.classname === user.className.classname){
            sinf_users.push({
              id: user.id,
              fullname: user.fullname,
              jinsi: user.jinsi,
              usertype: user.userType.role
            })
          }
        })
        data.push({
          classname: cl.classname,
          users: sinf_users
        })
        sinf_users=[]
      })
      return data;
    }
    catch (err) {
      throw new HttpException("Barcha userlarni olishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }

  async findAllUserKelmaganlar(sana: string){
    try {
      const kelmaganUsers = await this.userRepo
        .createQueryBuilder("user")
        .leftJoin(
          "user.yuqlamalar",
          "yuqlama",
          "yuqlama.createdAt LIKE :sana",
          { sana: `%${sana}%` }
        )
        .where("yuqlama.id IS NULL")
        .select([
          "user.id",
          "user.fullname",
          "className.classname"
        ])
        .leftJoin("user.className", "className")
        .getMany();
      
      return kelmaganUsers;
    } catch (err) {
      throw new HttpException("Barcha userlarni olishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }

  async findOneUser(id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: id } })
      if (!user) {
        throw new HttpException("Kechirasiz foydalanuvchi topilmadi !", HttpStatus.NOT_FOUND)
      }
      return user;
    }
    catch (err) {
      throw new HttpException("Foydalanuvchini olishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }

  async findOneUserAndUpdateLoginAndPassword(id: string, updateloginandpassworddto: UpdateLoginAndPasswordDto) {
    try {
      const user = await this.userRepo.findOne({ where: { id: id } })
      if (!user) {
        throw new HttpException("Kechirasiz foydalanuvchi topilmadi !", HttpStatus.NOT_FOUND)
      }
      await this.userRepo.update(id, updateloginandpassworddto)
      return "Ma'lumot yangilandi.";
    }
    catch (err) {
      throw new HttpException("Foydalanuvchini olishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: id } })
      if (!user) {
        throw new HttpException("Kechirasiz foydalanuvchi topilmadi !", HttpStatus.NOT_FOUND)
      }
      await this.userRepo.delete(id)
      return "Ushbu foydalanuvchi o'chirildi";
    }
    catch (err) {
      throw new HttpException("Userni o'chirishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }
  // classname bilan ishlash
  async createClassname(createClassnameDto: CreateClassNameDto) {
    try {
      const oldclass = await this.classNameRepo.findOne({ where: { classname: createClassnameDto.classname } })
      if (oldclass) {
        throw new HttpException("Kechirasiz ushbu sinf oldin yaratilgan", HttpStatus.BAD_REQUEST);
      }
      const newclass = this.classNameRepo.create(createClassnameDto)
      await this.classNameRepo.save(newclass)
      return newclass
    }
    catch (err) {
      throw new HttpException("Classname yaratishda muammo mavjud", HttpStatus.BAD_REQUEST)
    }
  }

  async getAllClassName() {
    try {
      return await this.classNameRepo.find()
    }
    catch (err) {
      throw new HttpException("ClassName larni olishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }

  async getOneClassName(id: string) {
    try {
      return await this.classNameRepo.findOne({ where: { id: id }, relations: {users: true} })
    }
    catch (err) {
      throw new HttpException("ClassName ni olishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }

  async updateOneClassName(id: string, updateclassnameDto: CreateClassNameDto) {
    try {
      const classnmae = await this.classNameRepo.findOne({ where: { id: id } })
      if (!classnmae) {
        throw new HttpException("ClassName topilmadi\n", HttpStatus.NOT_FOUND);
      }
      await this.classNameRepo.update(id, updateclassnameDto)
      return "Ma'lumot yangilandi."
    }
    catch (err) {
      throw new HttpException("ClassName ni o'zgartirishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }

  async deleteOneClassName(id: string) {
    try {
      const classnmae = await this.classNameRepo.findOne({ where: { id: id } })
      if (!classnmae) {
        throw new HttpException("ClassName topilmadi\n", HttpStatus.NOT_FOUND);
      }
      await this.classNameRepo.delete(id)
      return "Ma'lumot yangilandi."
    }
    catch (err) {
      throw new HttpException("ClassName ni o'chirishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }


  async login(loginDto: LoginDto) {
    try {
      const user = await this.userRepo.findOne({ where: { login: loginDto.login }, relations: {userType: true} })
      if (!user) {
        throw new HttpException("Foydalanuvchi topilmadi", HttpStatus.NOT_FOUND)
      }
      if (user.password != loginDto.password) {
        throw new HttpException("Foydalanuvchi ma'lumoti noto'g'ri", HttpStatus.BAD_REQUEST)
      }
      const payload = { user_id: user.id, role: user.userType.role };
      return {
        status: 200,
        message: "Yo'naltirilmoqda",
        token: await this.jwtService.signAsync(payload, { expiresIn: '2h' })
      };
    }
    catch (err) {
      throw new HttpException("Login qilishda hatolik bo'ldi. " + err, HttpStatus.BAD_REQUEST)
    }
  }


  async createUserByFile(createUserByFileDto: CreateUserByFileDto, doc) {
    try {
      const workbook = new Workbook()
      await workbook.xlsx.readFile(doc.path)
      const sheet = workbook.getWorksheet(1)
      const classname = await this.classNameRepo.findOne({ where: { id: createUserByFileDto.class_name } })
      if (!classname) {
        throw new HttpException("Kechirasiz ushbu fayldagi o'quvchilar qaysi sinfga mansubligi topilmadi ?", HttpStatus.BAD_REQUEST)
      }
      const usertype = await this.userTypeRepo.findOne({ where: { id: createUserByFileDto.user_type } })
      if (!usertype) {
        throw new HttpException("Kechirasiz ushbu fayldagi o'quvchilar qaysi user tipiga mansubligi topilmadi ?", HttpStatus.BAD_REQUEST)
      }
      sheet?.eachRow(async row => {
        var sana = row.values[5];
        var oy = parseInt(sana.split('.')[1]) >= 10 ? parseInt(sana.split('.')[1]) : '0' + parseInt(sana.split('.')[1])
        var kun = parseInt(sana.split('.')[0]) >= 10 ? parseInt(sana.split('.')[0]) : '0' + parseInt(sana.split('.')[0])
        var d = `${parseInt(sana.split(".")[2])}-${oy}-${kun}`
        var user = {
          fullname: row.values[3],
          className: classname,
          birthday: d,
          userType: usertype,
          jinsi: row.values[4],
          pas_seria: row.values[1],
          pas_number: row.values[2]
        }
        // console.log(user)
        const newuser = this.userRepo.create(user)
        await this.userRepo.save(newuser)
      })
      rm(doc.path, () => { })
      return "Barcha ma'lumotlar saqlandi."
    }
    catch (err) {
      throw new HttpException("Ma'lumotlar bilan ishlashda hatolik bo'ldi" + err, HttpStatus.BAD_REQUEST)
    }
  }

  async bugun() {
    try {
      const students = await this.userRepo.find({ relations: { userType: true }, where: { userType: { role: "Student" } } })
      const teachers = await this.userRepo.find({ relations: { userType: true }, where: { userType: { role: "Teacher" } } })
      const bugun = new Date().toISOString().split("T")[0].slice(5, 10)
      var listStudents = students.filter(student => {
        return student.birthday.toISOString().split("T")[0].slice(5, 10) == bugun
      })
      var listTeachers = teachers.filter(student => {
        return student.birthday.toISOString().split("T")[0].slice(5, 10) == bugun
      })
      return {
        students: listStudents,
        teachers: listTeachers
      }
    }
    catch (err) {
      throw new HttpException("Tug'ilgan kunlarni olishda muammo mavjud." + err, HttpStatus.BAD_REQUEST)
    }
  }
  checkCondidate() {
    try {
      return "ok"
    } catch (err) {
      throw new HttpException("Tekshirishda hatolik bo'ldi", HttpStatus.BAD_REQUEST)
    }
  }


  async getByUserType(usertype: string) {
    try {
      const users = await this.userRepo.find({ relations: { userType: true, className: true }, where: { userType: { id: usertype } } })
      return users
    }
    catch (err) {
      throw new HttpException("Ma'lumotni olishda muammo mavjud." + err, HttpStatus.BAD_REQUEST)
    }
  }
  async getBugunBirthday() {
    try {
      const bugun = new Date().toISOString().split("T")[0].slice(5, 10)
      const users = await this.userRepo.find()
      const data = users.filter(user => user.birthday.toISOString().split("T")[0].slice(5, 10) == bugun)
      return data;
    } catch (err) {
      throw new HttpException("Tug'ilgan kunlarni olishda muammo mavjud.", HttpStatus.BAD_REQUEST);
    }
  }

  async updateClassNameUser(id: string, updateUserClassnameDto: UpdateUserClassnameDto) {
    try {
      const user = await this.userRepo.findOne({ where: { id: id } })
      if (!user) {
        throw new HttpException("Kechirasiz foydalanuvchi topilmadi !", HttpStatus.NOT_FOUND)
      } 
      const classname = await this.classNameRepo.findOne({ where: { id: updateUserClassnameDto.classname_id } })
      if(!classname){
        throw new HttpException("Kechirasiz ushbu classname topilmadi !", HttpStatus.NOT_FOUND)
      } 
      user.className = classname
      await this.userRepo.save(user)
      return "Foydalanuvchining sinfi muvaffaqiyatli yangilandi."
    } catch (err) {
      throw new HttpException("Foydalanuvchining sinfini yangilashda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }

  async updateUserPhoto(id:string, photo: Express.Multer.File){
    try {
      const user = await this.userRepo.findOne({ where: { id: id } })
      if (!user) {
        rm(photo.path, () => { })
        throw new HttpException("Kechirasiz foydalanuvchi topilmadi !", HttpStatus.NOT_FOUND)
      }
      rm(user.imgUrl, ()=>{})
      user.imgUrl = photo.path
      await this.userRepo.save(user)
      return "Foydalanuvchining rasmi muvaffaqiyatli yangilandi."
    } catch (err) {
      throw new HttpException("Foydalanuvchining rasmini yangilashda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    }
  }

  async setloginandpassword(){  
    try {
      const users = await this.userRepo.find()
      let i=1;
      for(const user of users){
        if(user.login === "" || user.password === ""){
          user.login = 'user'+ i
          user.password = 'user'+ i
          i++;
          await this.userRepo.save(user)
        }
      }
      return "Barcha foydalanuvchilarning login va paroli muvaffaqiyatli o'rnatildi."
    } catch (err) {
      throw new HttpException("Foydalanuvchilarning login va parolini o'rnatishda muammo mavjud\n" + err, HttpStatus.BAD_REQUEST)
    } 
  }
}
