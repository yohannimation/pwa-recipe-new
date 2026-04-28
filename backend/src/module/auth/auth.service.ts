import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  generateToken(user: User) {
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async login(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    const isValid = await bcrypt.compare(password, user.password);
    if (!user || !isValid)
      throw new UnauthorizedException('Invalid credentials');

    return {
      token: this.generateToken(user),
    };
  }

  async register(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}
