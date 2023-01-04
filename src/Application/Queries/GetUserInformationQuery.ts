import {IUserRepository} from '../../Domain/Intefaces/IUserRepository';

export class GetUserInformationQuery {
  constructor(readonly userRepository: IUserRepository) {}

  async execute(id: string) {
    return await this.userRepository.getUserById(id);
  }
}
