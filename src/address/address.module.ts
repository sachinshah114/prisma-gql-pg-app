import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressResolver } from './address.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AddressService, AddressResolver, PrismaService]
})
export class AddressModule { }
