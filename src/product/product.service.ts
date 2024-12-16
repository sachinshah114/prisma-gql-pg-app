import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from 'dto/product.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) { }

    async createProduct(data: CreateProductDTO) {
        return this.prisma.product.create({
            data
        });
    }
}
