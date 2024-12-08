import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
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
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  //exports: [PrismaService]
})
export class AppModule { }
