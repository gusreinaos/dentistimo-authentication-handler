/* eslint-disable prettier/prettier */
import {IUserRepository} from '../../Intefaces/IUserRepository';

export class ValidateUserTokenService {
    constructor(readonly userRepository: IUserRepository) {}

    async validateEmail(email: string): Promise<boolean> {
        const user = await this.userRepository.getUserByEmail(email);
        return user?.jwtToken !== 'null'
    }

    async validateId(id: string): Promise<boolean> {
        const user = await this.userRepository.getUserById(id);
        return user?.jwtToken !== 'null'
    }
}
