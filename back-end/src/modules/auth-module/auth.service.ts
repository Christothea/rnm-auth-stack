import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../app-config/config.service';
import { User } from '../../database/models/user-db.model';
import { AccessTokenDto } from '../../dtos/access-token.dto';
import { LoginDto } from '../../dtos/login.dto';
import { UserDto } from '../../dtos/user.dto';
import { UserProfileDto } from '../../dtos/user.profile.dto';
import { HttpErrorCodeToMsgDto } from '../../http-errors/http-code-message.mapper';
import { LoggingService } from '../../logging/logging.service';
import { UserMapper } from '../users-module/user.mapper';
import { UsersService } from '../users-module/users.service';
import { JwtPayload } from './jtw/jwt-payload';

@Injectable()
export class AuthService {

  constructor(
    private loggingService: LoggingService,
    private usersService: UsersService,
    private jwtService: JwtService) {
    this.loggingService.setContext(AuthService.name);
  }

  public async login(loginDto: LoginDto): Promise<UserProfileDto> {
    const user: UserDto = await this.validateUser(loginDto);

    const token: AccessTokenDto = await this.createUserToken(user);

    if (!token) {
      this.loggingService.log(`login: unauthorized for user <${loginDto.email}>`);
      throw new UnauthorizedException('User credentials were incorrect.');
    }

    this.loggingService.log(`login: succeed for user <${loginDto.email}>`);

    return new UserProfileDto({
        accessToken: token,
        info: user
    });
  }

  private async createUserToken(user: UserDto): Promise<AccessTokenDto> {
    const payload: JwtPayload = {
      userEmail: user.email,
      timestamp: new Date()
    };

    return new AccessTokenDto({
      token: this.jwtService.sign(payload),
      expiresInHours: ConfigService.AppEnv.AUTH_CONFIG_TOKEN_EXPIRY_TIME_HOURS
    });
  }

  private async validateUser(loginDto: LoginDto): Promise<UserDto> {
    this.loggingService.log(`validateUser: <${loginDto.email}>`);

    const user: User = await this.usersService.findByEmail(loginDto.email.trim());

    if (!user) {
      throw new UnauthorizedException(HttpErrorCodeToMsgDto.ERR_UNAUTHORIZED_INVALID_USER);
    }

    const match = user.validatePassword(loginDto.password);

    if (!match) {
      this.loggingService.warn(`Invalid User Password: ${loginDto.email}`);
      throw new UnauthorizedException(HttpErrorCodeToMsgDto.ERR_UNAUTHORIZED_INVALID_PASSWORD);
    }

    return UserMapper.userModelToDto(user);
  }
}
