/* eslint-disable prettier/prettier */
import { User } from '../../Domain/Entities/User';
import { ErrorResponse } from '../../Domain/Responses/FlowResponse/ErrorResponse';
import { ProcessResponse } from '../../Domain/Responses/FlowResponse/ProcessResponse';
import { Response } from '../../Domain/Responses/FlowResponse/Response';
import { ValidateUserService } from '../../Domain/Services/Validations/ValidateUserService';
import { ValidateUserTokenService } from '../../Domain/Services/Validations/ValidateUserTokenService';
import { UserAlreadySignedOutError } from '../../Domain/Errors/UserAlreadySignedOutError';
import { UserNotFoundError } from '../../Domain/Errors/UserNotFoundError';
import { decrypt } from '../../Domain/Utils/CryptoUtils';
import {UserRepository} from '../../Infrastructure/Repositories/UserRepository';

export class SignOutUserCommand {

  constructor(readonly userRepository: UserRepository,
              readonly validateUserService: ValidateUserService,
              readonly validateUserTokenService: ValidateUserTokenService) {}

  async execute(encryptedMessage: string): Promise<Response> {

    const payload = decrypt(encryptedMessage);

    //Validate if the user that wants to log out exists
    const userExists = await this.validateUserService.validateId(payload.id)
    if(!userExists) {
      return ProcessResponse.Error(new ErrorResponse(UserNotFoundError.code, UserNotFoundError.detail))
    }

    //Validate if user token is already null
    const tokenExists = await this.validateUserTokenService.validateId(payload.id)
    if(!tokenExists) {
      return ProcessResponse.Error(new ErrorResponse(UserAlreadySignedOutError.code, UserAlreadySignedOutError.detail))
    }

    const foundUser = await this.userRepository.getUserById(payload.id);

    const newUser = new User(String(null), foundUser!.name, foundUser!.email, foundUser!.password)
    await this.userRepository.updateUserById(payload.id, newUser);

    return ProcessResponse.Success(newUser)
  }
}
