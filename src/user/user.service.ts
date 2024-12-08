import { Injectable } from '@nestjs/common';

import { CreateUserInputDTO } from 'dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async createUser(data: CreateUserInputDTO) {
        return this.prisma.user.create({ data });
    }

    async getUser() {
        return this.prisma.user.findMany({});
    }
}
