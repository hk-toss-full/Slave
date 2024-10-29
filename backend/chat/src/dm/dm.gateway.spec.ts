import { Test, TestingModule } from '@nestjs/testing';
import { DmGateway } from './dm.gateway';
import { DmService } from './dm.service';

describe('DmGateway', () => {
  let gateway: DmGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DmGateway, DmService],
    }).compile();

    gateway = module.get<DmGateway>(DmGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
