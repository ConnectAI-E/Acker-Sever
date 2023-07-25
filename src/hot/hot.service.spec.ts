import { Test, TestingModule } from '@nestjs/testing';
import { HotService } from './hot.service';

describe('HotService', () => {
  let service: HotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HotService],
    }).compile();

    service = module.get<HotService>(HotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
