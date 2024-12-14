import { Injectable } from '@nestjs/common';
import { UserRole } from 'entity/user.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getDashboardData() {
        const data = {
            cnts: await this.getDashboardCnts()
        }
        return data;
    }

    async getDashboardCnts() {
        let data = {
            usersCnt: 0 // Send number if "ACTIVE" users, Except admin, isBlocked, non vetified users
        }

        data.usersCnt = await this.prisma.user.count({
            where: {
                role: UserRole.USER,
                isBlocked: false,
                isVerified: true
            }
        });
        return data;
    }
}
