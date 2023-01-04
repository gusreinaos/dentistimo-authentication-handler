/* eslint-disable prettier/prettier */
import {User} from '../../Domain/Entities/User';
import { ValidateUserService } from '../../Domain/Services/Validations/ValidateUserService';
import {decrypt} from '../../Domain/Utils/CryptoUtils';
import {signJWT} from '../../Domain/Utils/JwtUtils';
import {UserRepository} from '../../Infrastructure/Repositories/UserRepository';
import { Response } from '../../Domain/Responses/FlowResponse/Response';
import { ProcessResponse } from '../../Domain/Responses/FlowResponse/ProcessResponse';
import { ErrorResponse } from '../../Domain/Responses/FlowResponse/ErrorResponse';
import { UserAlreadyExistsError } from '../../Domain/Errors/UserAlreadyExistsError';

export class SignUpUserCommand {

  constructor(readonly userRepository: UserRepository,
              readonly validateUserService: ValidateUserService) {}

  async execute(encryptedMessage: string): Promise<Response> {

    const payload = decrypt(encryptedMessage);

    const userExists = await this.validateUserService.validateEmail(payload.email)

    if(userExists) {
      return ProcessResponse.Error(new ErrorResponse(UserAlreadyExistsError.code, UserAlreadyExistsError.detail))
    }

    const user = new User('null', payload.name, payload.email, payload.password);

    const newUser = await this.userRepository.createUser(user);

    return ProcessResponse.Success(newUser)
  }
}
