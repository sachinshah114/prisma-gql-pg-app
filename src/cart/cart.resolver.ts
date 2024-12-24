import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { User, UserRole } from 'entity/user.entity';
import { ValidateGuard } from 'src/auth/validate.guard';
import { AddToCartDTO } from 'dto/cart.dto';
import { ProductService } from 'src/product/product.service';
import { Product } from 'entity/product.entity';
import { Cart } from 'entity/cart.entity';

@Resolver()
export class CartResolver {
    constructor(private readonly cartService: CartService,
        private readonly productService: ProductService
    ) { }

    @Mutation(() => String)
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.USER]), ValidateGuard)
    async addToCart(@Args('addToCart') addToCartDTO: AddToCartDTO, @Context() context: any) {
        const user = context.req.user as User;

        //Is product valid and exist...
        const isProductExist = await this.productService.getProductById(addToCartDTO.productId) as Product;
        if (!isProductExist)
            throw new BadRequestException('Product not found');

        //Add to cart and bind with this user's cart...
        addToCartDTO.userId = user.id;
        await this.cartService.addToCart(addToCartDTO);

        return { message: "Product added to cart successfully" }.message.toString();

    }

    @Query(() => [Cart])
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.USER]), ValidateGuard)
    async getCartDetails(@Context() context: any) {
        const user = context.req.user as User;

        return this.cartService.getCartDetails(user);
    }
}

/*
mutation AddToCart {
    addToCart(addToCart: { productId: 4, quantity: 2 })
}

*/
