/* eslint-disable prettier/prettier */
import {User} from '../../Domain/Entities/User';
import { ValidateUserService } from '../../Domain/Services/Validations/ValidateUserService';
import {decrypt} from '../../Domain/Utils/CryptoUtils';
import {signJWT} from '../../Domain/Utils/JwtUtils';
import {UserRepository} from '../../Infrastructure/Repositories/UserRepository';

export class SignUpUserCommand {
  constructor(readonly userRepository: UserRepository,
              readonly validateUserService: ValidateUserService) {}

  async execute(encryptedMessage: string): Promise<User | null> {

    const payload = decrypt(encryptedMessage);

    const userExists = await this.validateUserService.validateEmail(payload.email)

    if(userExists) {
      throw new Error('User with ' + payload.email + ' already exists')
    }

    const jwt = signJWT(payload)

    const user = new User(jwt, payload.name, payload.email, payload.password);

    return await this.userRepository.createUser(user);
  }
}
