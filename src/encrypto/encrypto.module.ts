import { Global, Module } from '@nestjs/common';
import { EncryptoService } from './encrypto.service';

@Global()
@Module({
  providers: [EncryptoService],
  exports: [EncryptoService],
})
export class EncryptoModule {}
