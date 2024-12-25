import { Injectable } from '@nestjs/common';
import { AddToCartDTO, RemoveItemFromDTO } from 'dto/cart.dto';
import { Cart } from 'entity/cart.entity';
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

    async placeOrder(user: User) {
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
    }
}
