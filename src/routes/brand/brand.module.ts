import { Module } from '@nestjs/common'
import { BrandService } from './brand.service'
import { BrandController } from './brand.controller'
import { BrandRepository } from './brand.repo'

@Module({
  providers: [BrandService, BrandRepository],
  controllers: [BrandController],
})
export class BrandModule {}
