/* eslint-disable prettier/prettier */
import { User } from '../../Domain/Entities/User';
import { ErrorResponse } from '../../Domain/Responses/FlowResponse/ErrorResponse';
import { ProcessResponse } from '../../Domain/Responses/FlowResponse/ProcessResponse';
import { Response } from '../../Domain/Responses/FlowResponse/Response';
import { ValidateUserService } from '../../Domain/Services/Validations/ValidateUserService';
import { ValidateUserTokenService } from '../../Domain/Services/Validations/ValidateUserTokenService';
import { decrypt } from '../../Domain/Utils/CryptoUtils';
import { signJWT } from '../../Domain/Utils/JwtUtils';
import {UserRepository} from '../../Infrastructure/Repositories/UserRepository';
import { UserNotFoundError } from '../../Domain/Errors/UserNotFoundError';
import { UserAlreadySignedInError } from '../../Domain/Errors/UserAlreadySignedInError';
import { UserIncorrectPasswordError } from '../../Domain/Errors/UserIncorrectPasswordError';

export class SignInUserCommand {

  constructor(readonly userRepository: UserRepository,
              readonly validateUserService: ValidateUserService,
              readonly validateUserTokenService: ValidateUserTokenService) {}

  async execute(encryptedMessage: string): Promise<Response> {

    const payload = decrypt(encryptedMessage);

    //Validate if user with the email exists
    const userExists = await this.validateUserService.validateEmail(payload.email)
    if(!userExists) {
      return ProcessResponse.Error(new ErrorResponse(UserNotFoundError.code, UserNotFoundError.detail))
    }

    //Valida if the password of the user is correct
    const passWordIsCorrect = await this.validateUserService.validatePassword(payload.email, payload.password)
    if (passWordIsCorrect) {
      return ProcessResponse.Error(new ErrorResponse(UserIncorrectPasswordError.code, UserIncorrectPasswordError.deatil))
    }

    //Validate if user token is null
    const tokenExists = await this.validateUserTokenService.validateEmail(payload.email)
    if(tokenExists) {
      return ProcessResponse.Error(new ErrorResponse(UserAlreadySignedInError.code, UserAlreadySignedInError.detail))
    }

    const foundUser = await this.userRepository.getUserByEmailAndPassword(payload.email, payload.password);

    const jwt = signJWT({name: foundUser!.name, email: foundUser!.email, password: foundUser!.password})

    const newUser = new User(jwt, foundUser!.name, foundUser!.email, foundUser!.password)

    await this.userRepository.updateUserByEmail(foundUser!.email, newUser);

    const user = await this.userRepository.getUserByEmail(payload.email);

    return ProcessResponse.Success(user!)
  }
}
