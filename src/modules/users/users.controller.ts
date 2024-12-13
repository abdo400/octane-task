import { 
    Controller, 
    Post, 
    Body, 
  } from '@nestjs/common';
  
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginDto } from './dto/login.dto';
import { AuthTokenDto } from './dto/auth-token.dto';
  
@Controller('users')
export class UserController {
constructor(private readonly userService: UserService) {}
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.userService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<AuthTokenDto> {
        return this.userService.login(loginDto);
    }
}