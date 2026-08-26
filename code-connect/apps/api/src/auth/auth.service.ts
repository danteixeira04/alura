import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';
import { UserEntity } from './user.entity';

type AppUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly users: AppUser[] = [
    {
      id: 'demo-user',
      name: 'Usuário Demo',
      email: 'demo@codeconnect.com',
      password: bcrypt.hashSync('demo123', 10),
    },
  ];

  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository?: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    if (!this.userRepository) {
      return;
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: 'demo@codeconnect.com' },
    });

    if (!existingUser) {
      await this.userRepository.save(
        this.userRepository.create({
          id: 'demo-user',
          name: 'Usuário Demo',
          email: 'demo@codeconnect.com',
          password: await bcrypt.hash('demo123', 10),
        }),
      );
    }
  }

  async register(payload: RegisterDto) {
    const existingUser = this.userRepository
      ? await this.userRepository.findOne({ where: { email: payload.email } })
      : this.users.find((user) => user.email === payload.email);

    if (existingUser) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const user: AppUser = {
      id: crypto.randomUUID(),
      name: payload.name,
      email: payload.email,
      password: await bcrypt.hash(payload.password, 10),
    };

    if (this.userRepository) {
      const saved = await this.userRepository.save(
        this.userRepository.create({
          ...user,
          password: user.password,
        }),
      );

      return this.buildAuthResponse(saved);
    }

    this.users.push(user);

    return this.buildAuthResponse(user);
  }

  async login(payload: LoginDto) {
    const user = this.userRepository
      ? await this.userRepository.findOne({ where: { email: payload.email } })
      : this.users.find((candidate) => candidate.email === payload.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    return this.buildAuthResponse(user);
  }

  async validateJwtPayload(payload: {
    sub: string;
    email: string;
    name: string;
  }) {
    const user = this.userRepository
      ? await this.userRepository.findOne({ where: { id: payload.sub } })
      : this.users.find((candidate) => candidate.id === payload.sub);

    if (!user) {
      throw new UnauthorizedException('Token inválido.');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  me(user: { id: string; email: string; name: string }) {
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  private buildAuthResponse(user: Partial<UserEntity> & AppUser) {
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
      }),
    };
  }
}
