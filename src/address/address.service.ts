import { Injectable } from '@nestjs/common';
import { CreateAddressInputDTO, UpdateAddressInputDTO } from 'dto/address.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AddressService {
    constructor(private prisma: PrismaService) { }
    //Add address
    async addAddress(data: CreateAddressInputDTO, userId: number) {

        //First fetch totla number of address. It this is first address, mark is at active default
        const total = await this.prisma.address.count({
            where: {
                userId: userId
            }
        });


        return this.prisma.address.create({
            data: {
                address1: data.address1,
                address2: data.address2,
                city: data.city,
                postcode: data.postcode.toUpperCase(),
                isActive: total > 0 ? false : true,
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
        delete data.id;
        return this.prisma.address.update({
            where: {
                id: addressId,
                userId: userId
            },
            data
        });
    }

    async getAllAddress(userId: number) {
        return this.prisma.address.findMany({
            where: {
                userId: userId,
                isDeleted: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async getAddressById(userId: number, addressId: number) {
        return this.prisma.address.findFirst({
            where: {
                userId: userId,
                id: addressId
            }
        });
    }

    async resetAllAddress(userId: number) {
        return this.prisma.address.updateMany({
            where: {
                userId: userId
            },
            data: {
                isActive: false
            }
        });
    }


}
