import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'THIS_IS_MY_TEST_SECERT_KEY_114',
      signOptions: { expiresIn: '60' },
    }),
  ],
  providers: [AuthService, AuthResolver, PrismaService, UserService],
})
export class AuthModule { }
