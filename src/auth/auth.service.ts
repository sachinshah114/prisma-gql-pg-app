import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
import { User } from 'entity/user.entity';
import { PrismaService } from 'src/prisma.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) { }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email
      }
    }) as User;
    if (user && (await bcrypt.compare(password, user.password))) {

      if (user.isVerified === false) {
        throw new BadRequestException('User email is not verified.');
      }

      const { password, ...result } = user; // Remove password from object
      return result;
    }
    return null;
  }

  async logIn(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin, role: user.role };
    return {
      access_token: this.createJwtToken(payload),
    };
  }

  createJwtToken(payload) {
    return this.jwtService.sign(payload);
  }

  async verifyJwtToken(token) {
    const verify = await this.jwtService.verifyAsync(token);
    return verify;
  }

  async decodeJwtToken(token) {
    const decode = await this.jwtService.decode(token);
    return decode;
  }
}
