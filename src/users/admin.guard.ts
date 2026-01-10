import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException("Autentifikatsiya muvoffaqqiyatli emas. Siz admin emassiz.");
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const userid = payload.user_id
      const user = await this.userRepo.findOne({relations: {userType: true}, where: {id: userid}})
      if (user.userType.role != "Admin"){
        throw new UnauthorizedException("Autentifikatsiya muvoffaqqiyatli emas. Siz admin emassiz.");
      }
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException("Autentifikatsiya muvoffaqqiyatli emas. Siz admin emassiz.");
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}