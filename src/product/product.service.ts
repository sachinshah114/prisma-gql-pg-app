import { Injectable } from '@nestjs/common';
import { CreateProductDTO, UploadProductImageDTO } from 'dto/product.dto';
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
}
