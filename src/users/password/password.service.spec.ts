import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // hash()
  // plain text - > hash
  // for the same input -> the same output
  // 12345678 -> asdasdasdadad
  // bcrypt.hash  -> was called
  //              -> password was passed to it & salt rounds
  // mocks & spies
  it('should hash password', async () => {
    const mockHash = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);
    const password = 'password123';
    const result = await service.hash(password);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(result).toBe(mockHash);
  });

  it('should fail on inccorect password', async () => {
    // 1) mock bcrypt.compare() -  fails
    // 2) mock the resolved value
    // 3) Call the service method - verify()
    // 4) bcrypt.compare - was called wit specific arguments
    // 5) We verify if the service method returned what bcrypt.compare did

    const mockHash = 'hashed_password';
    const plainPassword = 'password123';
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await service.verify(plainPassword, mockHash);
    expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, mockHash);
    expect(result).toBe(true);
  });
});
