import { Injectable } from '@nestjs/common';
import { CreateProductDTO, PaginationDTO, ProductFilterDTO, UploadProductImageDTO } from 'dto/product.dto';
import { User } from 'entity/user.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }

    async createProduct(data: CreateProductDTO) {
        return this.prisma.product.create({
            data
        });
    }

    async uploadProductImage(data: UploadProductImageDTO) {
        return this.prisma.productImages.create({
            data
        });
    }

    async validateProduct(productId: number, userId: number) {
        return this.prisma.product.findFirst({
            where: {
                id: productId,
                userId: userId
            },
            select: {
                id: true,
                hasImage: true
            }
        });
    }

    async resetDefaultImagesFlag(productId: number) {
        return this.prisma.productImages.updateMany({
            where: {
                productId
            },
            data: {
                isDefault: false
            }
        });
    }


    async getFilteredProducts(filters: ProductFilterDTO, pagination: PaginationDTO, user: User) {
        const { id, search, minPrice, maxPrice } = filters || {};
        const { limit = 10, page = 1 } = pagination || {};

        const where = {
            AND: [
                id ? { id } : undefined,
                search ? { name: { contains: search } } : undefined,
                // minPrice ? {
                //     price: {

                //     }
                // } : undefined,
            ],
        };

        const skip = (page - 1) * limit;

        console.log(`Where condtion is ::: `, where);
        console.log(`skip condtion is ::: `, skip);


        return this.prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
}
