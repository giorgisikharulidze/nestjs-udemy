import { Body, ClassSerializerInterceptor, Controller, Post, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from '../create-user.dto';
import { AuthService } from './auth.service';
import { User } from '../user.entity';
import { LoginDto } from '../login.dto';
import { LoginResponse } from '../login.response';
import { use } from 'passport';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({strategy: 'excludeAll'})
export class AuthController {

    constructor (
        private readonly authService: AuthService,
    ){}
    
    @Post('register')   
    public async register(@Body() createUserDto: CreateUserDto):Promise<User>{
        const user = await this.authService.register(createUserDto); 
        return user;
 }   

    @Post('login')
    public async login(@Body() loginDto: LoginDto):Promise<LoginResponse>{
        const accessToken =  await this.authService.login(loginDto.email,loginDto.password);

        return  new LoginResponse({accessToken});
    }
}
