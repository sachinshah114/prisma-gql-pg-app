import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { ChangeOrderStatusDTO, GetOrderDetailsByIdDTO, GetOrderHistoryDTO } from 'dto/order.dto';
import { PaginationDTO } from 'dto/product.dto';
import { User, UserRole } from 'entity/user.entity';
import { validateDateAndReturnDate } from 'src/common/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrderService {
    constructor(private readonly prisma: PrismaService) { }
    /*
    If the user is admin, return all the order history, 
    If it's User, only returns his orders...
     */
    async getOrderHistory(orderFilters: GetOrderHistoryDTO, pagination: PaginationDTO, user: User) {
        const { limit = 10, page = 1 } = pagination || {};
        const skip = (page - 1) * limit;
        const { id, minPrice, maxPrice, fromDate, toDate, status } = orderFilters || {};

        let formattedFromDate = fromDate ? validateDateAndReturnDate(fromDate) : null;
        let formattedToDate = toDate ? validateDateAndReturnDate(toDate) : null;

        const where: any = {
            AND: [
                ...(user.role === UserRole.USER ? [{ userId: user.id }] : []),
                ...(id ? [{ id }] : []),
                ...(status ? [{ status: status.toUpperCase() }] : []),
                ...(minPrice !== undefined ? [{ price: { gte: minPrice } }] : []),
                ...(maxPrice !== undefined ? [{ price: { lte: maxPrice } }] : []),

                ...(fromDate !== undefined ? [{ createdAt: { gte: formattedFromDate } }] : []),
                ...(toDate !== undefined ? [{ createdAt: { lte: formattedToDate } }] : []),
            ],
        };

        console.log(`[WHERE] ::: `, JSON.stringify(where));


        const list = await this.prisma.order.findMany({
            where,
            include: {
                orderItems: {
                    include: {
                        Product: {
                            include: {
                                ProductImages: true
                            }
                        }
                    }
                }
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const total = list.length > 0 ? await this.prisma.order.count({
            where
        }) : 0;

        return {
            list,
            total
        }
    }

    async isOrderExist(data: GetOrderDetailsByIdDTO) {
        return await this.prisma.order.findFirst({
            where: {
                id: data.id
            }
        });
    }

    async getOrderDetailsById(data: GetOrderDetailsByIdDTO) {
        const fetchData = await this.prisma.order.findFirst({
            where: {
                id: data.id
            },
            include: {
                orderItems: {
                    include: {
                        Product: {
                            include: {
                                ProductImages: {
                                    where: {
                                        isDefault: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        console.log(`[fetchData] ::: `, JSON.stringify(fetchData));

        return fetchData;
    }

    async updateOrderById(data: ChangeOrderStatusDTO) {
        return this.prisma.order.update({
            data: {
                status: data.status.toUpperCase() as OrderStatus,
            },
            where: {
                id: data.id
            }
        });
    }
}
