/* eslint-disable prettier/prettier */
import { User } from '../../Domain/Entities/User';
import { decrypt } from '../../Domain/Utils/CryptoUtils';
import {UserRepository} from '../../Infrastructure/Repositories/UserRepository';

export class SignOutUserCommand {
  constructor(readonly userRepository: UserRepository) {}

  async execute(encryptedMessage: string): Promise<User | null> {
    const payload = decrypt(encryptedMessage);

    const foundUser = this.userRepository.getUserById(payload.id);
    if (foundUser === null) {
        return null;
    }

    const newUser = new User(String(null), payload.name, payload.email, payload.password)
    return this.userRepository.updateUser(newUser);
  }
}
