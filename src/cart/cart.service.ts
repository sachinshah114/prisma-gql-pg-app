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
        console.log(`\n\n\ngetUsersCartDetails `, getUsersCartDetails);


        // Fetch product ids and get product details to store...
        const orderItems = getUsersCartDetails.map(x => x.productId);
        console.log(`\n\n\norderItems `, orderItems);

        const getProductDetails = await this.prisma.product.findMany({
            where: {
                id: {
                    in: orderItems
                }
            }
        });
        console.log(`\n\n\ngetProductDetails `, getProductDetails);

        let grandTotal = 0;
        //Fist Place an order and create order Id.
        //[TODO] - Need to work on coupon appied stuff...
        //[TODO] - Add a code for authorize card payment - (total price after discount)
        let orderObj = {
            addressId: addressId,
            userId: user.id
        }
        console.log(`\n\n\orderObj `, orderObj);
        const Order = await this.prisma.order.create({
            data: orderObj
        });

        let orderProducts = [];
        for (let i = 0; i < getUsersCartDetails.length; i++) {
            let cart = getUsersCartDetails[i];
            let productPrice = getProductDetails.find(x => x.id == cart.productId).price;
            let cost = (productPrice * cart.quantity);
            grandTotal += cost;
            orderProducts.push({
                orderId: Order.id,
                //orderId: 1,
                productId: cart.productId,
                quantity: cart.quantity,
                productPrice: productPrice,
                productTotal: cost
            } as OrderItems);

        }

        //Insert this all in order items 
        await this.prisma.orderItems.createMany({
            data: orderProducts
        });

        //Now update the grand total in main order table...        
        await this.prisma.order.update({
            data: {
                price: grandTotal,
                total: grandTotal //[TODO] - Reduce amount if coupon code has been used...
            },
            where: {
                id: Order.id
            }
        });

        //At last, Now make a cart clear as user placed the order...
        await this.prisma.cart.deleteMany({
            where: {
                userId: user.id
            }
        });
        return true;
    }
}
