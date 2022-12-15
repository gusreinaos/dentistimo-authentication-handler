/* eslint-disable prettier/prettier */
import {User} from '../../Domain/Entities/User';
import {decrypt} from '../../Domain/Utils/CryptoUtils';
import {signJWT} from '../../Domain/Utils/JwtUtils';
import {UserRepository} from '../../Infrastructure/Repositories/UserRepository';

export class SignUpUserCommand {
  constructor(readonly userRepository: UserRepository) {}

  async execute(encryptedMessage: string): Promise<User | null> {

    const payload = decrypt(encryptedMessage);

    const jwt = signJWT({name: payload.name, email: payload.email, password: payload.password})

    const user = new User(jwt, payload.name, payload.email, payload.password);
    return await this.userRepository.createUser(user);
  }
}
