import { Test, TestingModule } from '@nestjs/testing';
import { PermissService } from './permiss.service';

describe('PermissService', () => {
  let service: PermissService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissService],
    }).compile();

    service = module.get<PermissService>(PermissService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
