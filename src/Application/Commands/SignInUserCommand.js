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
const UserNotFoundError_1 = require("../../Domain/Types/Errors/UserNotFoundError");
const UserAlreadySignedInError_1 = require("../../Domain/Types/Errors/UserAlreadySignedInError");
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
            //Validate if user token is already null
            const tokenExists = yield this.validateUserTokenService.validateEmail(payload.email);
            if (tokenExists) {
                return ProcessResponse_1.ProcessResponse.Error(new ErrorResponse_1.ErrorResponse(UserAlreadySignedInError_1.UserAlreadySignedInError.code, UserAlreadySignedInError_1.UserAlreadySignedInError.detail));
            }
            const foundUser = yield this.userRepository.getUserByEmailAndPassword(payload.email, payload.password);
            const jwt = (0, JwtUtils_1.signJWT)({ name: foundUser.name, email: foundUser.email, password: foundUser.password });
            const newUser = new User_1.User(jwt, payload.name, payload.email, payload.password);
            const user = yield this.userRepository.updateUserByEmail(foundUser.email, newUser);
            return ProcessResponse_1.ProcessResponse.Success(user);
        });
    }
}
exports.SignInUserCommand = SignInUserCommand;
