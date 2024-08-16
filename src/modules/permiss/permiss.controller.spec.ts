import { Test, TestingModule } from '@nestjs/testing';
import { PermissController } from './permiss.controller';
import { PermissService } from './permiss.service';

describe('PermissController', () => {
  let controller: PermissController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissController],
      providers: [PermissService],
    }).compile();

    controller = module.get<PermissController>(PermissController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
