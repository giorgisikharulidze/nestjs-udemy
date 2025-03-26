import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../create-user.dto';
import { AuthService } from './auth.service';
import { User } from '../user.entity';
import { LoginDto } from '../login.dto';
import { LoginResponse } from '../login.response';
import { UserService } from '../user/user.service';
import { AuthRequest } from './auth.request';
import { AuthGuard } from '../auth.guard';
import { Public } from '../decorator/public.decorator';
import { AdminResponse } from './admin.response';
import { Role } from '../role.enum';
import { Roles } from '../decorator/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @ApiBody({
    description: 'Register a new user',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'User@example.com' },
        password: { type: 'string', example: '1qaz!QAZ' },
        name: { type: 'string', example: 'User' }
      }
    }
  })  
  @Public()
  public async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.authService.register(createUserDto);
    return user;
  }
 
  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiBody({
    description: 'User login data',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'gsikharulidze@example.com' },  // Default value
        password: { type: 'string', example: '1qaz!QAZ' } // Default value
      },
    },
  })
  @Public()
  public async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return new LoginResponse({ accessToken });
  }

  @Get('/profile')
  async profile(@Request() request: AuthRequest): Promise<User> {
    const user = await this.userService.findOne(request.user.sub);

    if (user) {
      return user;
    }
    throw new NotFoundException();
  }

  @Get('admin') //auth/admin
  @Roles(Role.AMDIN)
  async adminOnly(): Promise<AdminResponse> {
    return new AdminResponse({ message: 'This is for admins only!' });
  }
}
