import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PasswordService } from '../password/password.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  // 1) find the user by email
  // 2) create user
  // 3) fetch the user by id

  public async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await this.passwordService.hash(
      createUserDto.password,
    );
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashPassword,
    });

    return await this.userRepository.save(user);
  }

  public async findOne(id: string): Promise<User | null>{

    return await this.userRepository.findOneBy({id});
  }
  
}
