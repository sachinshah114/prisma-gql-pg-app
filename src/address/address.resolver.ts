import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddressService } from './address.service';
import { Address } from 'entity/address.entity';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { CreateAddressInputDTO, UpdateAddressInputDTO } from 'dto/address.dto';
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


    @Query(() => [Address])
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.USER]))
    async getAddressList(@Context() context: any) {
        const user = context.req.user as User;
        return this.addressService.getAllAddress(user.id);
    }

    @Mutation(() => Address)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.USER]))
    async updateAddress(@Args('updateAddress') updateAddressInputDTO: UpdateAddressInputDTO, @Context() context: any) {
        const user = context.req.user as User;

        //First validate user and attached address details... Is ID valid and attached to this user or not...
        const isValid = await this.addressService.getAddressById(user.id, updateAddressInputDTO.id);
        if (!isValid) return new BadRequestException('Invalid Address details');

        //If user try to change any address as default address, reset all address as false first...
        if ('isActive' in updateAddressInputDTO)
            await this.addressService.resetAllAddress(user.id);

        return this.addressService.updateAddress(updateAddressInputDTO, user.id, updateAddressInputDTO.id);
    }

}
