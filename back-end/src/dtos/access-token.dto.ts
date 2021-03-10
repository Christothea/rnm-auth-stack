import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {

    constructor(partial: Partial<AccessTokenDto> = {}) {
        Object.assign(this, partial);
    }

    /**
     * @description Number of hours after which the token will expire
     */
    @ApiProperty({
        name: 'expiresInHours',
        type: Number,
    })
    public expiresInHours: number;

    @ApiProperty({
        name: 'token',
        type: String,
    })
    public token: string;
}