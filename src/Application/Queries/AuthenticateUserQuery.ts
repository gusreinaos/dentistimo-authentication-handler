import {UserRepository} from '../../Infrastructure/Repositories/UserRepository';

export class AuthenticateUserQuery {
  constructor(readonly userRepository: UserRepository) {}

  async execute(jwt: string): Promise<string> {
    this.userRepository.getUserByAccessToken(jwt);
    return '';
  }
}
