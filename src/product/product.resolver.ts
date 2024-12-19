import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from 'entity/product.entity';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { User, UserRole } from 'entity/user.entity';
import { ValidateGuard } from 'src/auth/validate.guard';
import { CreateProductDTO, PaginationDTO, ProductFilterDTO, UploadProductImageDTO } from 'dto/product.dto';
import { ProductImages } from 'entity/product-images.entity';

@Resolver()
export class ProductResolver {
    constructor(private readonly productService: ProductService) {
    }

    @Mutation(() => Product)
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.ADMIN, UserRole.USER]), ValidateGuard)
    async createProduct(@Args('createProduct') createProductDTO: CreateProductDTO, @Context() context: any) {
        const user = context.req.user as User;
        createProductDTO.userId = user.id;
        return this.productService.createProduct(createProductDTO);
    }

    @Mutation(() => ProductImages)
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.ADMIN, UserRole.USER]), ValidateGuard)
    async uploadImage(@Args('uploadProductImage') uploadProductImageDTO: UploadProductImageDTO, @Context() context: any) {
        const user = context.req.user as User;

        //validate Product Id exist and matched with this user's id with relation...
        const isValidProductId = await this.productService.validateProduct(uploadProductImageDTO.productId, user.id);
        if (!isValidProductId.id)
            throw new BadRequestException('Invalid product');

        if (uploadProductImageDTO.isDefault)
            await this.productService.resetDefaultImagesFlag(uploadProductImageDTO.productId);

        return this.productService.uploadProductImage(uploadProductImageDTO);
    }

    /* 
        API which will returns all the products as list...
        USER - Only gets his own items only
        ADMIN - Gets all the products
    */
    @Query(() => [Product], { name: 'getProductList' })
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.ADMIN, UserRole.USER]), ValidateGuard)
    async getProductList(
        @Args('filters', { type: () => ProductFilterDTO, nullable: true }) filters: ProductFilterDTO,
        @Args('pagination', { type: () => PaginationDTO, nullable: true }) pagination: PaginationDTO,
        @Context() context: any
    ) {
        const user = context.req.user as User;
        return this.productService.getFilteredProducts(filters, pagination, user);
    }
}
