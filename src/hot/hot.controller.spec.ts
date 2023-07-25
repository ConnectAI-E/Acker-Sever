import { Test, TestingModule } from '@nestjs/testing';
import { HotController } from './hot.controller';

describe('HotController', () => {
  let controller: HotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotController],
    }).compile();

    controller = module.get<HotController>(HotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
