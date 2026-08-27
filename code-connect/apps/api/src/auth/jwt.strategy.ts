import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'code-connect-secret',
    });
  }

  async validate(payload: { sub: string; email: string; name: string }) {
    try {
      return await this.authService.validateJwtPayload(payload);
    } catch {
      throw new UnauthorizedException('Token inválido.');
    }
  }
}
