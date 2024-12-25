import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { BadGatewayException, BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { User, UserRole } from 'entity/user.entity';
import { ValidateGuard } from 'src/auth/validate.guard';
import { AddToCartDTO, RemoveItemFromDTO } from 'dto/cart.dto';
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

    //Remove any item from cart...
    @Mutation(() => String)
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.USER]), ValidateGuard)
    async removeItemfromCart(@Args('removeItemfromCart') removeItemFromDTO: RemoveItemFromDTO, @Context() context: any) {
        const user = context.req.user as User;

        //Validate id with this user and exist...
        const isCartIdValid = await this.cartService.isCartValid(removeItemFromDTO, user);
        if (!isCartIdValid)
            throw new BadGatewayException('Data not found.');

        //Data found so now remove it...
        await this.cartService.removeItemfromCart(removeItemFromDTO);
        return { message: "Product removed from cart successfully" }.message.toString();

    }

    /*
        To place the order, The whole cart will be consider to place the order...
    */
    @Mutation(() => String)
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.USER]), ValidateGuard)
    async placeOrder(@Context() context: any) {
        const user = context.req.user as User;
        const cartDetails = await this.cartService.getCartDetails(user);
        if (cartDetails.length > 0) {
            //validate user has any address setup and fetch isActive = True address...
            const getUserDefaultActiveAddress = await this.cartService.getUserDefaultActiveAddress(user);
            if (!getUserDefaultActiveAddress) throw new BadRequestException("Please setup address first to place the order.");

            await this.cartService.placeOrder(user, getUserDefaultActiveAddress.id);
            return { message: "Your order has been placed successfully" }.message.toString();
        } else {
            throw new BadRequestException("Cart is empty to place the order");
        }
    }

}

/*
mutation AddToCart {
    addToCart(addToCart: { productId: 4, quantity: 2 })
}

query GetCartDetails {
    getCartDetails {
        userId
        productId
        quantity
        createdAt
        product {
            id
            name
            description
            price
            userId
            isActive
            hasImage
            createdAt
            updatedAt
            reviewsCount
            ProductImages {
                id
                image
                isDefault
                productId
                createdAt
            }
        }
    }
}


mutation{
  removeItemfromCart(removeItemfromCart:{
    id: 2
  })
}

mutation{
  placeOrder
}
  
*/
