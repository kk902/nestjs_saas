import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;
  constructor(private readonly jwtService: JwtService) {}
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async generateToken(userData: User): Promise<string> {
    delete userData.password
    userData.user_id = userData._id
    return this.jwtService.sign(userData);
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      // 处理 token 验证错误
      throw new Error('Invalid token');
    }
  }
}