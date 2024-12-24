import { Injectable } from '@nestjs/common';
import { AddToCartDTO } from 'dto/cart.dto';
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
}
