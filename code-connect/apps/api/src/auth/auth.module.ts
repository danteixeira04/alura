import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserEntity } from './user.entity';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'code-connect-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthService,
      useFactory: (
        jwtService: JwtService,
        userRepository: Repository<UserEntity>,
      ) => new AuthService(jwtService, userRepository),
      inject: [JwtService, getRepositoryToken(UserEntity)],
    },
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
