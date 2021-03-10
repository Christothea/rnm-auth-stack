import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    constructor(partial: Partial<LoginDto> = {}) {
        this.email = '';
        this.password = '';
        Object.assign(this, partial);
    }

    @ApiProperty({
        name: 'email',
        type: String,
        required: false,
        description: 'email',
    })
    @IsEmail(undefined, { message: 'Invalid Email' })
    @IsNotEmpty()
    @Type(() => String)
    email: string;

    @ApiProperty({
        name: 'password',
        type: String,
        description: 'User password',
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    password: string;
}