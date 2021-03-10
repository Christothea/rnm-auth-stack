import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../database/models/user-db.model';
import { Repositories } from '../../database/repositories.enum';
import { HttpErrorMsgDto } from '../../dtos/http-errors/http-error-msg.dto';
import { UserDto } from '../../dtos/user.dto';
import { HttpErrorCodeToMsgDto } from '../../http-errors/http-code-message.mapper';
import { LoggingService } from '../../logging/logging.service';
import { UserMapper } from './user.mapper';

@Injectable()
export class UsersService {
    constructor(
        @Inject(Repositories.USERS_REPOSITORY) private userModel: typeof User,
        private readonly loggingService: LoggingService,
    ) {
        this.loggingService.setContext(UsersService.name);
    }

    public async create(userDto: UserDto): Promise<UserDto> {
        this.loggingService.verbose(`create: <${userDto.email}>`);

        try {
            const user: User = await this.userModel.create(UserMapper.userDtoToModel(userDto));

            if (!user) {
                this.loggingService.warn(`create: DB Action Failed for <${userDto.email}>`);
                throw new InternalServerErrorException(HttpErrorCodeToMsgDto.ERR_INTERNAL_SERVER_ERROR);
            } else {
                return UserMapper.userModelToDto(user);
            }
        } catch (ex) {
            if ((ex.name === 'SequelizeUniqueConstraintError')) {
                this.loggingService.warn(`create: DB Action Unique Constraint Violation <${userDto.email}>`, ex.stack);
                const httpErrorDto: HttpErrorMsgDto = new HttpErrorMsgDto({ ...HttpErrorCodeToMsgDto.ERR_VALIDATION });
                httpErrorDto.details.push({ message: `'email' already in use`, path: ['email'], value: userDto.email });
                throw new BadRequestException(httpErrorDto);
            }
            this.loggingService.error(`create: DB Action Exception for <${userDto.email}>`, ex.stack);
            throw ex;
        }
    }

    public async findByEmail(email: string): Promise<User> {
        this.loggingService.verbose(`findByEmail: <${email}>`);

        try {
            return await this.userModel.findOne({
                where: {
                    email,
                },
            });
        } catch (ex) {
            this.loggingService.error(`findByEmail: <${email}>: DB Action Exception`, ex.stack);
            throw ex;
        }
    }
}