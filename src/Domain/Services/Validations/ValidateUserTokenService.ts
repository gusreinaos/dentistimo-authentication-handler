/* eslint-disable prettier/prettier */
import {IUserRepository} from '../../Intefaces/IUserRepository';

export class ValidateUserTokenService {
    constructor(readonly userRepository: IUserRepository) {}

    async validate(email: string): Promise<boolean> {
        const user = await this.userRepository.getUserByEmail(email);
        return user?.jwtToken !== 'null'
    }
}
