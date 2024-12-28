import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { BadGatewayException, BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { User, UserRole } from 'entity/user.entity';
import { ValidateGuard } from 'src/auth/validate.guard';
import { ChangeOrderStatusDTO, GetOrderDetailsByIdDTO, GetOrderHistoryDTO, OrderListResponse } from 'dto/order.dto';
import { PaginationDTO } from 'dto/product.dto';
import { Order } from 'entity/order.entity';

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

    @Query(() => Order)
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.ADMIN, UserRole.USER]), ValidateGuard)
    async getOrderDetailsById(@Args('getOrderDetailsById') getOrderDetailsByIdDTO: GetOrderDetailsByIdDTO, @Context() context: any) {
        const user = context.req.user as User;

        const isValidOrderId = await this.orderService.isOrderExist(getOrderDetailsByIdDTO);
        if (!isValidOrderId) throw new BadRequestException("Order data not found");
        console.log(`[isValidOrderId] ::: `, isValidOrderId);


        //First validate this order id is related to this user if role is user. Allow details if role is admin.
        if (user.role === UserRole.USER) {
            if (isValidOrderId.userId !== user.id) throw new BadGatewayException("Order id data not matched.");
        }
        return this.orderService.getOrderDetailsById(getOrderDetailsByIdDTO);
    }

    @Mutation(() => String)
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.ADMIN]), ValidateGuard)
    async changeOrderStatus(@Args('getOrderDetailsById') changeOrderStatusDTO: ChangeOrderStatusDTO) {
        const isValidOrderId = await this.orderService.isOrderExist(changeOrderStatusDTO);
        if (!isValidOrderId) throw new BadRequestException("Order data not found");

        //Update the status in db 
        changeOrderStatusDTO.status = changeOrderStatusDTO.status.toUpperCase();
        await this.orderService.updateOrderById(changeOrderStatusDTO);
        return { message: "Order status updated successfully" }.message.toString();
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


query GetOrderDetailsById {
    getOrderDetailsById(getOrderDetailsById: { id: 3 }) {
        id
        price
        discountPrice
        total
        status
        createdAt
        updatedAt
        orderItems {
            id
            productId
            productPrice
            productTotal
            quantity
            Product {
                id
                name
                description
                ProductImages {
                    id
                    image
                    isDefault
                }
            }
        }
    }
}

*/
