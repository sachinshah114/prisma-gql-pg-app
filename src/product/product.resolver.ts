import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from 'entity/product.entity';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { User, UserRole } from 'entity/user.entity';
import { ValidateGuard } from 'src/auth/validate.guard';
import { CreateProductDTO, PaginationDTO, ProductFilterDTO, ProductListResponse, ProductReviewsDTO, UploadProductImageDTO } from 'dto/product.dto';
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
        console.log(isValidProductId);

        if (!isValidProductId || !isValidProductId.id)
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
    @Query(() => ProductListResponse, { name: 'getProductList' })
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

    @Mutation(() => String)
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.USER]), ValidateGuard)
    async addProductReview(@Args('addProductReview') productReviewsDTO: ProductReviewsDTO, @Context() context: any) {
        const user = context.req.user as User;
        productReviewsDTO.userId = user.id;

        //Validate product first and user can't give a reivew to his own product...
        const ownProduct = await this.productService.validateProduct(productReviewsDTO.productId, user.id);

        if (ownProduct)
            return new BadRequestException('You must not give a review to your own product');

        const getProductDetails = await this.productService.getProductById(productReviewsDTO.productId);

        if (!getProductDetails)
            return new BadRequestException('Product not found');

        //All right... So now add a review of the product...
        await this.productService.addProductReview(productReviewsDTO);
        return { message: "Product review added successfully" }.message.toString();
    }
}


/*

mutation CreateProduct {
    createProduct(
        createProduct: { name: "swift", description: "Best car", price: 500000, image: ["http://google.com/1.jpg", "http://google.com/2.jpg", "http://google.com/3.jpg"]}
    ) {
        id
        name
        description
        price
        userId
        isActive        
        createdAt
        updatedAt
        reviewsCount
    }
}

*/