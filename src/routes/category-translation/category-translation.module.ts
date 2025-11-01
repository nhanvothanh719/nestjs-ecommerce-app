import { Module } from '@nestjs/common'
import { CategoryTranslationService } from './category-translation.service'
import { CategoryTranslationController } from './category-translation.controller'
import { CategoryTranslationRepository } from './category-translation.repo'

@Module({
  providers: [CategoryTranslationService, CategoryTranslationRepository],
  controllers: [CategoryTranslationController],
})
export class CategoryTranslationModule {}
