import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform input to DTO instance
      whitelist: true, // Remove properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw error for extra properties
      exceptionFactory: (validationErrors: ValidationError[]) => {
        // Custom error format
        console.log(`This is the validation error ::: `, validationErrors);

        const formattedErrors = validationErrors.map((error) => ({
          field: error.property,
          constraints: Object.values(error.constraints || {}),
        }));
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     exceptionFactory: (validationErrors: ValidationError[] = []) => {
  //       return new BadRequestException(
  //         validationErrors.map((error) => ({
  //           field: error.property,
  //           error: Object.values(error.constraints).join(', '),
  //         })),
  //       );
  //     },
  //   }),
  // );


  // new ValidationPipe({
  //   transform: true,
  //   transformOptions: {
  //     enableImplicitConversion: true,
  //   },
  //   whitelist: true,
  // })


  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     exceptionFactory: (errors) => {
  //       const customErrors = errors.map((error) => ({
  //         field: error.property,
  //         errors: Object.values(error.constraints || []), // Collect all validation messages for the field
  //       }));
  //       console.log(`Custom errors ::: `, customErrors);

  //       return new BadRequestException({
  //         statusCode: 400,
  //         message: 'Validation failed',
  //         errors: customErrors,
  //       });
  //     },
  //     forbidUnknownValues: true,
  //     whitelist: true,
  //     transform: true,
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //     // disableErrorMessages: true
  //   }),
  // );    
  app.enableCors();
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
