import { Module } from '@nestjs/common';

import { HashUtilityService } from './hash-utility.service';

@Module({
  providers: [HashUtilityService],
  exports: [HashUtilityService],
})
export class HashUtilityModule {}
