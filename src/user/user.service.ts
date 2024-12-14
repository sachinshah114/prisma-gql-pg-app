import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateUserInputDTO } from 'dto/create-user.dto';
import { EditProfileDTO } from 'dto/edit-profile.dto';
import { User } from 'entity/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/common/emailService';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private readonly authService: AuthService
    ) { }

    async isUserUniqueByEmail(email: string) {
        return this.prisma.user.findFirst({
            where: {
                email: email
            },
            select: {
                id: true
            }
        });
    }

    async findOneByEmail(email: string) {
        return this.prisma.user.findFirst({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true
            }
        }) as unknown as User;
    }

    async getProfile(email: string) {
        return this.prisma.user.findFirst({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true,
                name: true,
                isBlocked: true,
                isVerified: true,
                phone: true
            }
        }) as unknown as User;
    }

    async createUser(data: CreateUserInputDTO) {
        return this.prisma.user.create({ data });
    }

    async getUser() {
        return this.prisma.user.findMany({});
    }

    sendVerificationEmail(user: User) {
        const emailToken = this.authService.createJwtToken({
            email: user.email,
            id: user.id
        });
        console.log(`emailToken ::: `, emailToken);

        return;
        const emailService = new EmailService();
        const emailHtml = `
        <h1>Welcome to Our App, ${user.name}!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${emailToken}">Verify Email</a>
        <p>This link will expire in 1 hour.</p>
    `;
        emailService.sendEmail(user.email, 'Verify Your Email', emailHtml);

    }

    async verifyUserByEmailToken(token: string) {
        const verifyToken = await this.authService.verifyJwtToken(token);
        if (!verifyToken) throw new BadRequestException("Token Expired");

        const decode = await this.authService.decodeJwtToken(token) as User;
        if (!decode) throw new BadRequestException("Something went wrong.");

        //Now mark this user as verified user...+
        const data = { isVerified: true }
        await this.prisma.user.update({
            where: {
                id: decode.id
            },
            data
        });

        return { message: 'User email verified successfully' }.message.toString();
    }

    async updateUserDetails(data: any, user: User) {
        return await this.prisma.user.update({
            where: {
                email: user.email
            },
            data
        });
    }
}
