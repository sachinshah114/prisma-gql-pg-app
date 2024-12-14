import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User, UserRole } from 'entity/user.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ValidateGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user as User;
        console.log("Validate User guard User ::: ", user);
        if (user.role == UserRole.ADMIN)
            return true;
        const userDetails = await this.prisma.user.findFirst({
            where: {
                id: user.id
            }
        });
        console.log("Fetched User Details in ValidateGuard::: ", userDetails);
        if (userDetails.isBlocked) {
            console.log("User blocked found::: ");
            throw new ForbiddenException('You are blocked by the admin.');
        }
        else
            return true;
    }
}