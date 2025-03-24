import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let dto = new CreateUserDto();

  beforeEach(() => {
    dto = new CreateUserDto();
    dto.email = 'gsikh@test.com';
    dto.name = 'Giorgi';
    dto.password = '123456';
  });

  it('should validate complete valid data', async () => {
    // 3xA
    // Arange

    // Act
    const errors = await validate(dto);

    //Assert
    expect(errors.length).toBe(0);
  });

  it('should fail on invalid email', async () => {
    // Arange

    dto.email = 'test.com';

    // Act
    const errors = await validate(dto);

    //Assert
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });
});
