import { User } from "../entities/user.entity";

// DTO for User Response (what to return to client)
export class UserResponseDto {
    id: number;
    username: string;
    role: 'user' | 'admin';
  
    // Static method to transform entity to response DTO
    static fromEntity(user: User): UserResponseDto {
      return {
        id: user.id,
        username: user.username,
        role: user.role
      };
    }
  }