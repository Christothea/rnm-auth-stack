import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '../../../app-config/config.service';
import { UserDto } from '../../../dtos/user.dto';
import { HttpErrorCodeToMsgDto } from '../../../http-errors/http-code-message.mapper';
import { LoggingService } from '../../../logging/logging.service';
import { UserMapper } from '../../../modules/users-module/user.mapper';
import { UsersService } from '../../users-module/users.service';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private usersService: UsersService,
    private loggingService: LoggingService) {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ConfigService.AppEnv.AUTH_CONFIG_TOKEN_SECRET_KEY,
    });

    this.loggingService.setContext(JwtStrategy.name);
  }

  async validate(payload: JwtPayload): Promise<UserDto> {
    try {
      return UserMapper.userModelToDto(await this.usersService.findByEmail(payload.userEmail));
    } catch (ex) {
      this.loggingService.error(`validate Exception: ${payload.userEmail}`, ex.stack);
      throw new InternalServerErrorException(HttpErrorCodeToMsgDto.ERR_INTERNAL_SERVER_ERROR);
    }
  }
}
