import * as crypto from 'crypto';
import { BeforeCreate, BeforeUpdate, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {

    constructor(partial: Partial<User> = {}) {
        super();
        Object.assign(this, partial);
    }

    @Column({
        type: DataType.STRING(1000),
        allowNull: false,
    })
    fullName: string;

    @Column({
        type: DataType.STRING(1000),
        allowNull: true,
        unique: { name: 'unique_email', msg: 'Unique constraint violation on user email' },
    })
    email?: string;

    @Column({
        allowNull: false,
        type: DataType.STRING(255),
    })
    public get password(): string {
        return this.getDataValue('password');
    }

    public set password(value: string) {
        this.setDataValue('password', value);
    }

    @Column
    public get salt(): string {
        return this.getDataValue('salt');
    }

    public set salt(value: string) {
        this.setDataValue('salt', value);
    }

    public generateSalt() {
        return crypto.randomBytes(16).toString('base64');
    }

    public encryptPassword(plainText, salt) {
        return crypto
            .createHash('RSA-SHA256')
            .update(plainText)
            .update(salt)
            .digest('hex');
    }

    @BeforeUpdate
    @BeforeCreate
    static setSaltAndPassword(user: User) {
        if (user.changed('password')) {
            user.salt = user.generateSalt();
            user.password = user.encryptPassword(user.password, user.salt);
        }
    }

    public validatePassword(enteredPassword): boolean {
        return this.encryptPassword(enteredPassword, this.salt) === this.password;
    }
}