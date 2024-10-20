import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
// import { IsUniqueConstraint } from 'src/prisma/is_unique_prisma_validators';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
