/* eslint-disable prettier/prettier */
import { ValidateUserService } from '../../Domain/Services/Validations/ValidateUserService';
import {UserRepository} from '../../Infrastructure/Repositories/UserRepository';
import { Response } from '../../Domain/Responses/FlowResponse/Response';
import { ProcessResponse } from '../../Domain/Responses/FlowResponse/ProcessResponse';
import { ErrorResponse } from '../../Domain/Responses/FlowResponse/ErrorResponse';
import { UserNotFoundError } from '../../Domain/Errors/UserNotFoundError';
import { ValidateUserTokenService } from '../../Domain/Services/Validations/ValidateUserTokenService';
import { UserNotAuthenticatedError } from '../../Domain/Errors/UnerNotAuthenticatedError';

export class AuthenticateUserQuery {
  constructor(readonly userRepository: UserRepository,
              readonly validateUserService: ValidateUserService,
              readonly validateUserTokenService: ValidateUserTokenService) {}

  async execute(payload: string): Promise<Response> {

    const message = JSON.parse(payload)

    const userExists = await this.validateUserService.validateId(message.id)
    if(!userExists) {
      return ProcessResponse.Error(new ErrorResponse(UserNotFoundError.code, UserNotFoundError.detail))
    }

    const tokenExists = await this.validateUserTokenService.validateId(message.id)
    if(!tokenExists) {
      return ProcessResponse.Error(new ErrorResponse(UserNotAuthenticatedError.code, UserNotAuthenticatedError.detail))
    }


    console.log(message)

    const user = await this.userRepository.getUserById(message.id);

    return ProcessResponse.Success(user!)
  }

}
