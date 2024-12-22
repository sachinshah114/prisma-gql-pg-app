import { Injectable } from '@nestjs/common';
import { CreateProductDTO, PaginationDTO, ProductFilterDTO, ProductReviewsDTO, UploadProductImageDTO } from 'dto/product.dto';
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
        const { id, search, minPrice, maxPrice, ownProductsOnly } = filters || {};
        const { limit = 10, page = 1 } = pagination || {};

        const where: any = {
            AND: [
                ...(id ? [{ id }] : []),
                ...(search ? [{ name: { contains: search } }] : []),
                ...(minPrice !== undefined ? [{ price: { gte: minPrice } }] : []),
                ...(maxPrice !== undefined ? [{ price: { lte: maxPrice } }] : []),
                ...(ownProductsOnly === true) ? [{ userId: user.id }] : []
            ],
        };

        const skip = (page - 1) * limit;

        console.log(`Where condtion is ::: `, JSON.stringify(where));
        console.log(`skip condtion is ::: `, skip);

        let list = await this.prisma.product.findMany({
            where,
            include: {
                ProductImages: true,
                _count: {
                    select: {
                        ProductReviews: true
                    }
                }
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        list = list.map((product) => ({
            ...product,
            reviewsCount: product._count.ProductReviews,
            _count: undefined,
        }));

        // Get the total count of products
        const total = list.length > 0 ? await this.prisma.product.count({ where }) : 0;
        return {
            list,
            total,
        }
    }

    async getProductById(productId: number) {
        return this.prisma.product.findFirst({
            where: {
                id: productId
            }
        });
    }

    async addProductReview(data: ProductReviewsDTO) {
        return this.prisma.productReviews.create({ data });
    }
}
