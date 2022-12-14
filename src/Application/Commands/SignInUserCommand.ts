/* eslint-disable prettier/prettier */
import { User } from '../../Domain/Entities/User';
import {decodeJWT} from '../../Domain/Utils/JwtUtils';
import {UserRepository} from '../../Infrastructure/Repositories/UserRepository';

export class SignInUserCommand {
  constructor(readonly userRepository: UserRepository) {}

  async execute(jwt: string): Promise<User | null> {

    const payload = decodeJWT(jwt);

    const foundUser = this.userRepository.getUser(payload.email, payload.password);
    if (foundUser === null) {
        return null;
    }

    const newUser = new User(jwt, payload.name, payload.email, payload.password)
    return this.userRepository.updateUser(newUser);
  }
}
