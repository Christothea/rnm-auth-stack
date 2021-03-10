import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpErrorMsgDto } from '../../dtos/http-errors/http-error-msg.dto';
import { UserDto } from '../../dtos/user.dto';
import { LoginDto } from '../../dtos/login.dto';
import { UserProfileDto } from '../../dtos/user.profile.dto';
import { LoggingService } from '../../logging/logging.service';
import { UsersService } from '../users-module/users.service';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly loggingService: LoggingService) {
        this.loggingService.setContext(AuthController.name);
    }

    @Post('register')
    @ApiOperation(
        {
            summary: 'Registers a new user',
        })
    @ApiBody({ type: UserDto })
    @ApiCreatedResponse({ type: UserDto })
    @ApiBadRequestResponse({ type: HttpErrorMsgDto })
    @ApiInternalServerErrorResponse({ type: HttpErrorMsgDto })
    async register(@Body() userDto: UserDto): Promise<UserDto> {
        this.loggingService.verbose(`register User: ${userDto.toString()}`);
        return this.usersService.create(userDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Authenticates User and returns Bearer Token and User record' })
    @ApiBody({ type: () => LoginDto })
    @ApiCreatedResponse({ type: () => UserProfileDto })
    @ApiBadRequestResponse({ type: HttpErrorMsgDto })
    @ApiInternalServerErrorResponse({ type: HttpErrorMsgDto })
    async login(@Body() loginDto: LoginDto): Promise<UserProfileDto> {
        this.loggingService.log(`login: called from user <${loginDto.email}>`);
        return await this.authService.login(loginDto);
    }
}
