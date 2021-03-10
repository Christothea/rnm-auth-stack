import { User } from '../../database/models/user-db.model';
import { UserDto } from '../../dtos/user.dto';

/**
 * @class
 * @name UserMapper
 * @description Maps User Db Models to Dtos and the opposite
 */
export class UserMapper {

    public static userModelToDto(user: User): UserDto {
        return user ? new UserDto({
            email: user.email,
            fullName: user.fullName
        }) : undefined;
    }

    public static userDtoToModel(userDto: UserDto): User {
        return userDto ? new User({
            email: userDto.email,
            fullName: userDto.fullName,
            password: userDto.password
        }) : undefined;
    }
}