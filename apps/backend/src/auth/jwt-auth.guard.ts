import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        // `info` contains why authentication failed
        if (info?.name === 'TokenExpiredError') {
            console.log("Token Expired!")
            throw new UnauthorizedException('Token Expired');
        }

        if (err || !user) {
            throw err || new UnauthorizedException('Invalid token.');
        }

        return user;
    }
}
