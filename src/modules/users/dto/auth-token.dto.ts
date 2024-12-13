import { IsString } from 'class-validator';

// DTO for Authentication Token
export class AuthTokenDto {
    @IsString()
    accessToken: string;
  
    @IsString()
    refreshToken: string;
  }