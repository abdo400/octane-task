import { IsString, MinLength, MaxLength, Matches, IsEnum } from 'class-validator';

// DTO for User Registration
export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username cannot be longer than 20 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, { 
    message: 'Username can only contain letters, numbers, underscorelss, and hyphens' 
  })
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: 'Password must include uppercase, lowercase, number, and special character'
  })
  password: string;

  @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin' })
  role: 'user' | 'admin' = 'user';
}