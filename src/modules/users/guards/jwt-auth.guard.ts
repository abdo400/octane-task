import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded; // Attach the decoded token to the request object

      return true;
    } catch (error) {
      console.log(`Token error: ${JSON.stringify( error)}`)
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
