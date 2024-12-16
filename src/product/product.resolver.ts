import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from 'entity/product.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { User, UserRole } from 'entity/user.entity';
import { ValidateGuard } from 'src/auth/validate.guard';
import { CreateProductDTO } from 'dto/product.dto';

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
}
