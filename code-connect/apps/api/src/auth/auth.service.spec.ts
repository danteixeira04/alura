import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService(new JwtService({ secret: 'test-secret' }));
  });

  it('registers a user and returns a token', async () => {
    const result = await service.register({
      name: 'João',
      email: 'joao@codeconnect.com',
      password: 'secret123',
    });

    expect(result.user.email).toBe('joao@codeconnect.com');
    expect(result.access_token).toBeTruthy();
  });

  it('logs in a registered user', async () => {
    await service.register({
      name: 'Maria',
      email: 'maria@codeconnect.com',
      password: 'senha123',
    });

    const result = await service.login({
      email: 'maria@codeconnect.com',
      password: 'senha123',
    });

    expect(result.user.email).toBe('maria@codeconnect.com');
    expect(result.access_token).toBeTruthy();
  });
});
