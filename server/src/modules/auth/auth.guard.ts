import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context?.switchToHttp()?.getRequest();

    const { [jwtConstants.cookieName]: token } = request.cookies;

    try {
      const payload: Record<string, any> = await this.jwtService.verifyAsync(
        `${token}`,
        {
          secret: jwtConstants.secret,
        },
      );

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
