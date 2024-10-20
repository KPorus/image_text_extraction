import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ValidateModule } from './validate/validate.module';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from './s3/s3.module';
import { EncryptoModule } from './encrypto/encrypto.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    ValidateModule,
    S3Module,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EncryptoModule,
  ],
})
export class AppModule {}
