import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLISODateTime, GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AddressModule } from './address/address.module';
import { FilterObjectGuard } from './common/common';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProductModule } from './product/product.module';
import { CouponModule } from './coupon/coupon.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),

      playground: false,
      plugins: [],
      resolvers: { DateTime: GraphQLISODateTime },
      context: ({ req, res }) => ({ req, res }),
      formatError: (err) => ({
        message: err.message,
        status: err.extensions.code,
        errors: err.extensions.originalError
      }),


      // definitions: {
      //   path: join(process.cwd(), 'src/graphql.ts'),
      //   outputAs: 'class',
      // },
      // formatError: (error) => {
      //   const graphQLFormattedError = {
      //     message: error.message,
      //     errors: error?.extensions?.originalError,
      //   };
      //   return graphQLFormattedError;
      // },
    }),
    AuthModule,
    UserModule,
    AddressModule,
    DashboardModule,
    ProductModule,
    CouponModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: FilterObjectGuard,
    },
  ],
})
export class AppModule {

}
