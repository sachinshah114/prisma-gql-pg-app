import { Injectable } from '@nestjs/common';

import { CreateUserInputDTO } from 'dto/create-user.dto';
import { User } from 'entity/user.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

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
                isAdmin: true,
                password: true,
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
                isAdmin: true,
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
}
