import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginDto } from './dto/login.dto';
import { AuthTokenDto } from './dto/auth-token.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // User Registration
  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { username, password, role } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ 
      where: { username } 
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role
    });

    await this.userRepository.save(user);

    return UserResponseDto.fromEntity(user);
  }

  // User Login
  async login(loginDto: LoginDto): Promise<AuthTokenDto> {
    const { username, password } = loginDto;
    // Find user
    const user = await this.userRepository.findOne({ 
      where: { username },
      select: ['id', 'username', 'password', 'role']
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    return this.generateTokens(user);
  }

  // Token Generation
  private generateTokens(user: User): AuthTokenDto {
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

    const accessToken = jwt.sign(
      { 
        sub: user.id, 
        username: user.username, 
        role: user.role 
      },
      accessTokenSecret,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { 
        sub: user.id, 
        username: user.username 
      },
      refreshTokenSecret,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
}