"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInUserCommand = void 0;
/* eslint-disable prettier/prettier */
const User_1 = require("../../Domain/Entities/User");
const ErrorResponse_1 = require("../../Domain/Responses/FlowResponse/ErrorResponse");
const ProcessResponse_1 = require("../../Domain/Responses/FlowResponse/ProcessResponse");
const CryptoUtils_1 = require("../../Domain/Utils/CryptoUtils");
const JwtUtils_1 = require("../../Domain/Utils/JwtUtils");
const UserNotFoundError_1 = require("../../Domain/Errors/UserNotFoundError");
const UserAlreadySignedInError_1 = require("../../Domain/Errors/UserAlreadySignedInError");
const UserIncorrectPasswordError_1 = require("../../Domain/Errors/UserIncorrectPasswordError");
class SignInUserCommand {
    constructor(userRepository, validateUserService, validateUserTokenService) {
        this.userRepository = userRepository;
        this.validateUserService = validateUserService;
        this.validateUserTokenService = validateUserTokenService;
    }
    execute(encryptedMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = (0, CryptoUtils_1.decrypt)(encryptedMessage);
            //Validate if user with the email exists
            const userExists = yield this.validateUserService.validateEmail(payload.email);
            if (!userExists) {
                return ProcessResponse_1.ProcessResponse.Error(new ErrorResponse_1.ErrorResponse(UserNotFoundError_1.UserNotFoundError.code, UserNotFoundError_1.UserNotFoundError.detail));
            }
            //Valida if the password of the user is correct
            const passWordIsCorrect = yield this.validateUserService.validatePassword(payload.email, payload.password);
            if (passWordIsCorrect) {
                return ProcessResponse_1.ProcessResponse.Error(new ErrorResponse_1.ErrorResponse(UserIncorrectPasswordError_1.UserIncorrectPasswordError.code, UserIncorrectPasswordError_1.UserIncorrectPasswordError.deatil));
            }
            //Validate if user token is null
            const tokenExists = yield this.validateUserTokenService.validateEmail(payload.email);
            if (tokenExists) {
                return ProcessResponse_1.ProcessResponse.Error(new ErrorResponse_1.ErrorResponse(UserAlreadySignedInError_1.UserAlreadySignedInError.code, UserAlreadySignedInError_1.UserAlreadySignedInError.detail));
            }
            const foundUser = yield this.userRepository.getUserByEmailAndPassword(payload.email, payload.password);
            const jwt = (0, JwtUtils_1.signJWT)({ name: foundUser.name, email: foundUser.email, password: foundUser.password });
            const newUser = new User_1.User(jwt, foundUser.name, foundUser.email, foundUser.password);
            yield this.userRepository.updateUserByEmail(foundUser.email, newUser);
            const user = yield this.userRepository.getUserByEmail(payload.email);
            return ProcessResponse_1.ProcessResponse.Success(user);
        });
    }
}
exports.SignInUserCommand = SignInUserCommand;
