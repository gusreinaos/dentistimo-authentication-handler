import {User} from '../../Domain/Entities/User';
import {decodeJWT} from '../../Domain/Utils/JwtUtils';
import {UserRepository} from '../../Infrastructure/Repositories/UserRepository';

export class CreateUserCommand {
  constructor(readonly userRepository: UserRepository) {}

  async execute(jwt: string): Promise<User | null> {
    const payload = decodeJWT(jwt);
    const user = new User(jwt, payload.name, payload.email, payload.password);
    return await this.userRepository.createUser(user);
  }
}
