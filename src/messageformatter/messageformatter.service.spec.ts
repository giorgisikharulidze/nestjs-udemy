import { Test, TestingModule } from '@nestjs/testing';
import { MessageformatterService } from './messageformatter.service';

describe('MessageformatterService', () => {
  let service: MessageformatterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageformatterService],
    }).compile();

    service = module.get<MessageformatterService>(MessageformatterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
