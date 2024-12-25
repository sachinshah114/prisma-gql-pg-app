import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from 'entity/order.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { User, UserRole } from 'entity/user.entity';
import { ValidateGuard } from 'src/auth/validate.guard';
import { GetOrderHistoryDTO, OrderListResponse } from 'dto/order.dto';
import { PaginationDTO } from 'dto/product.dto';

@Resolver()
export class OrderResolver {
    constructor(private readonly orderService: OrderService) { }
    @Query(() => OrderListResponse)
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.ADMIN, UserRole.USER]), ValidateGuard)
    async getOrderHistory(
        @Args('orderFilters', { type: () => GetOrderHistoryDTO, nullable: true }) orderFilters: GetOrderHistoryDTO,
        @Args('pagination', { type: () => PaginationDTO, nullable: true }) pagination: PaginationDTO,
        @Context() context: any) {
        const user = context.req.user as User;

        return this.orderService.getOrderHistory(orderFilters, pagination, user);
    }
}

/*

query GetOrderHistory {
    getOrderHistory(
        pagination: { limit: 10, page: 1 }
        orderFilters: {
            minPrice: 500000
            maxPrice: 600000
            fromDate: "2024-12-25"
            toDate: "2024-12-31"
            status: "PENDING"
        }
    ) {
        list {
            id
            price
            discountPrice
            total
            status
            createdAt
            updatedAt
        }
        total
    }
}
*/
