import { Injectable } from '@nestjs/common';
import { AddToCartDTO, RemoveItemFromDTO } from 'dto/cart.dto';
import { OrderItems } from 'entity/order-item.entity';
import { User } from 'entity/user.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }
    async addToCart(data: AddToCartDTO) {
        return this.prisma.cart.create({ data });
    }

    async getCartDetails(user: User) {
        return this.prisma.cart.findMany({
            where: {
                userId: user.id
            },
            include: {
                product: {
                    include: {
                        ProductImages: {
                            where: {
                                isDefault: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async isCartValid(data: RemoveItemFromDTO, user: User) {
        return this.prisma.cart.findFirst({
            where: {
                id: data.id,
                userId: user.id
            }
        });
    }

    async removeItemfromCart(data: RemoveItemFromDTO) {
        return this.prisma.cart.delete({
            where: {
                id: data.id
            }
        });
    }

    async getUserDefaultActiveAddress(user: User) {
        return this.prisma.address.findFirst({
            where: {
                userId: user.id,
                isActive: true
            }
        });
    }

    async placeOrder(user: User, addressId: number) {
        const getUsersCartDetails = await this.prisma.cart.findMany({
            where: {
                userId: user.id
            },
        });

        console.log(`[getUsersCartDetails] ::: `, getUsersCartDetails);

        // Fetch product ids and get product details to store...
        const orderItems = getUsersCartDetails.map(x => x.productId);

        const getProductDetails = await this.prisma.product.findMany({
            where: {
                id: {
                    in: orderItems
                }
            }
        });
        console.log(`[getProductDetails] ::: `, JSON.stringify(getProductDetails));

        //Fist Place an order and create order Id.
        let orderObj = {
            addressId: addressId,
            userId: user.id
        }
        const Order = await this.prisma.order.create({
            data: orderObj
        });
        console.log(` \n\n\n [Order] ::: `, JSON.stringify(Order));
        let orderProducts = [];
        for (let i = 0; i < getUsersCartDetails.length; i++) {
            orderProducts.push({
                orderId: Order.id,
                productId: getUsersCartDetails[i].productId,
                quantity: getUsersCartDetails[i].quantity
            } as OrderItems);
        }
        console.log(` \n\n\n [orderProducts array] ::: `, JSON.stringify(orderProducts));

        //Insert this all in order items 
        const subOrderDetails = await this.prisma.orderItems.createMany({
            data: orderProducts
        });
        console.log(` \n\n\n [subOrderDetails] ::: `, JSON.stringify(subOrderDetails));
    }
}
