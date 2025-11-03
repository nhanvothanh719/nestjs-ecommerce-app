import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { ProductRepository } from './product.repo'
import { ProductManagementService } from './product-management.service';
import { ProductManagementController } from './product-management.controller';

@Module({
  providers: [ProductService, ProductRepository, ProductManagementService],
  controllers: [ProductController, ProductManagementController],
})
export class ProductModule {}
