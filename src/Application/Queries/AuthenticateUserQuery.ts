/* eslint-disable prettier/prettier */
import {UserRepository} from '../../Infrastructure/Repositories/UserRepository';

export class AuthenticateUserQuery {
  constructor(readonly userRepository: UserRepository) {}

  async execute(jwt: string): Promise<boolean> {

    const user = await this.userRepository.getUserByAccessToken(jwt);

    if (user !== null) {
      return true;
    }
    return false;
  }
}
