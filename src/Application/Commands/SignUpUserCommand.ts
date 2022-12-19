/* eslint-disable prettier/prettier */
import {v4 as uuidv4} from 'uuid';
import {User} from '../../Domain/Entities/User';
import {decrypt} from '../../Domain/Utils/CryptoUtils';
import {signJWT} from '../../Domain/Utils/JwtUtils';
import {UserRepository} from '../../Infrastructure/Repositories/UserRepository';

export class SignUpUserCommand {
  constructor(readonly userRepository: UserRepository) {}

  async execute(encryptedMessage: string): Promise<User | null> {

    const payload = decrypt(encryptedMessage);

    const jwt = signJWT(payload)

    const user = new User(jwt, payload.name, payload.email, payload.password);

    return await this.userRepository.createUser(user);
  }
}
