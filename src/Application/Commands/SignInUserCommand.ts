/* eslint-disable prettier/prettier */
import { User } from '../../Domain/Entities/User';
import { decrypt } from '../../Domain/Utils/CryptoUtils';
import { signJWT } from '../../Domain/Utils/JwtUtils';
import {UserRepository} from '../../Infrastructure/Repositories/UserRepository';

export class SignInUserCommand {
  constructor(readonly userRepository: UserRepository) {}

  async execute(encryptedMessage: string): Promise<User | null> {

    const payload = decrypt(encryptedMessage);

    const foundUser = await this.userRepository.getUserById(payload.id);
    if (foundUser === null) {
        return null;
    }

    //Let user logged in
    const jwt = signJWT({name: foundUser.name, email: foundUser.email, password: foundUser.password})

    const newUser = new User(jwt, payload.name, payload.email, payload.password)
    return this.userRepository.updateUser(newUser);
  }
}
