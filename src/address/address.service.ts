import { Injectable } from '@nestjs/common';
import { CreateAddressInputDTO, UpdateAddressInputDTO } from 'dto/address.dto';
import { User } from 'entity/user.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AddressService {
    constructor(private prisma: PrismaService) { }
    //Add address
    async addAddress(data: CreateAddressInputDTO, userId: number) {
        return this.prisma.address.create({
            data: {
                address1: data.address,
                address2: data.address2 || null,
                city: data.city,
                postcode: data.postcode,
                isActive: false,
                isDeleted: false,
                User: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    }

    async updateAddress(data: UpdateAddressInputDTO, userId: number, addressId: number) {
        return this.prisma.address.update({
            where: {
                id: addressId,
                userId: userId
            },
            data
        });
    }
}
