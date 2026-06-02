import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    const adminEmail = this.configService.getOrThrow<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.getOrThrow<string>('ADMIN_PASSWORD');

    if (email !== adminEmail || pass !== adminPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: 1, email: adminEmail, role: 'admin' };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: 1,
        email: adminEmail,
        name: 'Admin',
        role: 'admin',
      },
    };
  }
}
