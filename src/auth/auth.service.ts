import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');
import { UserService } from '../user/user.service';
import { User } from 'entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email) as User;
    if (user && (await bcrypt.compare(password, user.password))) {
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

    const payload = { userId: user.id, email: user.email, isAdmin: user.isAdmin, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
