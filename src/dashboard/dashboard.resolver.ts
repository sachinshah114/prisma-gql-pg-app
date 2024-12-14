import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { UserRole } from 'entity/user.entity';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { DashboardService } from './dashboard.service';
import { GraphQLJSONObject } from 'graphql-type-json';

@Resolver()
export class DashboardResolver {

    constructor(private readonly dashboardServrvice: DashboardService) { }

    @Query(() => GraphQLJSONObject)
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.ADMIN]))
    async dashboard() {
        return await this.dashboardServrvice.getDashboardData();
    }
}
