import { Test, TestingModule } from '@nestjs/testing';
import { BrandTranslationController } from './brand-translation.controller';

describe('BrandTranslationController', () => {
  let controller: BrandTranslationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandTranslationController],
    }).compile();

    controller = module.get<BrandTranslationController>(BrandTranslationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
