/* eslint-disable prettier/prettier */
import {User} from '../../Domain/Entities/User';
import {decrypt} from '../../Domain/Utils/CryptoUtils';
import {signJWT} from '../../Domain/Utils/JwtUtils';
import {UserRepository} from '../../Infrastructure/Repositories/UserRepository';

export class SignUpUserCommand {
  constructor(readonly userRepository: UserRepository) {}

  async execute(encryptedMessage: string): Promise<User | null> {

    const payload = decrypt(encryptedMessage);

    const parsedMessage = JSON.parse(payload)

    const jwt = signJWT(payload)

    const user = new User(jwt, parsedMessage.name, parsedMessage.email, parsedMessage.password);
    console.log(user)
    return await this.userRepository.createUser(user);
  }
}
