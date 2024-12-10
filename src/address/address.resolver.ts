import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AddressService } from './address.service';
import { Address } from 'entity/address.entity';
import { UseGuards } from '@nestjs/common';
import { CreateAddressInputDTO } from 'dto/address.dto';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { User, UserRole } from 'entity/user.entity';

@Resolver()
export class AddressResolver {
    constructor(private readonly addressService: AddressService) { }

    @Mutation(() => Address)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.USER]))
    async createAddress(@Args('createAddress') createAddressInputDTO: CreateAddressInputDTO, @Context() context: any) {
        const user = context.req.user as User;
        return this.addressService.addAddress(createAddressInputDTO, user.id);
    }
}
