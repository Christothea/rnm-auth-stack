import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { IUser } from '../interfaces/user.interface';

export class UserDto implements IUser {

    constructor(partial: Partial<UserDto> = {}) {
        this.fullName = '';
        this.email = '';
        this.password = '';
        Object.assign(this, partial);
    }

    @ApiProperty({
        name: 'fullName',
        type: String,
        description: 'User Full Name',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(5, { message: 'Fullname must be at least 5 characters long' })
    @Type(() => String)
    fullName: string;

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
    @Matches(/(?=.*\d)(?![.\n])((?=.*[a-z])|(?=.*[A-Z])).*$/, { message: 'Password must contain at least one letter and one number' })
    @MinLength(8, {message: 'Password must at least 8 characters long'})
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    password: string;
}