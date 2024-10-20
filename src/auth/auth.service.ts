import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ILoginBody, IRegisterBody } from './dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async login(dto: ILoginBody) {
    const user = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const valid = await argon2.verify(user.password, dto.pass);
    if (!valid) {
      throw new Error('Invalid credentials');
    }
    delete user.password;
    return this.signToken(user.id, user.email);
  }

  async register(dto: IRegisterBody) {
    try {
      const hash = await argon2.hash(dto.pass);
      const user = await this.prisma.users.create({
        data: {
          first_name: dto.first_name,
          last_name: dto.last_name,
          username: dto.username,
          email: dto.email,
          password: hash,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async signToken(
    id: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: id, email };
    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });

    return {
      access_token: token,
    };
  }
}
