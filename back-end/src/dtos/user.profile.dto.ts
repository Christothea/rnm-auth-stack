import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { AccessTokenDto } from './access-token.dto';
import { UserDto } from './user.dto';

export class UserProfileDto {
    constructor(partial: Partial<UserProfileDto> = {}) {
        this.accessToken = new AccessTokenDto();
        this.info = new UserDto();
        Object.assign(this, partial);
    }

    @ApiProperty({
        name: 'accessToken',
        type: () => AccessTokenDto,
        required: false,
        readOnly: true,
        description: 'Access Token',
    })
    @Type(() => AccessTokenDto)
    public accessToken: AccessTokenDto;

    @ApiProperty({
        name: 'info',
        type: () => UserDto,
        required: false,
        readOnly: true,
        description: 'User Record',
    })
    @Type(() => UserDto)
    public info: UserDto;
}