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
exports.SignOutUserCommand = void 0;
/* eslint-disable prettier/prettier */
const User_1 = require("../../Domain/Entities/User");
const ErrorResponse_1 = require("../../Domain/Responses/FlowResponse/ErrorResponse");
const ProcessResponse_1 = require("../../Domain/Responses/FlowResponse/ProcessResponse");
const UserAlreadySignedOutError_1 = require("../../Domain/Types/Errors/UserAlreadySignedOutError");
const UserNotFoundError_1 = require("../../Domain/Types/Errors/UserNotFoundError");
const CryptoUtils_1 = require("../../Domain/Utils/CryptoUtils");
class SignOutUserCommand {
    constructor(userRepository, validateUserService, validateUserTokenService) {
        this.userRepository = userRepository;
        this.validateUserService = validateUserService;
        this.validateUserTokenService = validateUserTokenService;
    }
    execute(encryptedMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = (0, CryptoUtils_1.decrypt)(encryptedMessage);
            //Validate if the user that wants to log out exists
            const userExists = yield this.validateUserService.validateId(payload.id);
            if (!userExists) {
                return ProcessResponse_1.ProcessResponse.Error(new ErrorResponse_1.ErrorResponse(UserNotFoundError_1.UserNotFoundError.code, UserNotFoundError_1.UserNotFoundError.detail));
            }
            //Validate if user token is already null
            const tokenExists = yield this.validateUserTokenService.validateId(payload.id);
            if (!tokenExists) {
                return ProcessResponse_1.ProcessResponse.Error(new ErrorResponse_1.ErrorResponse(UserAlreadySignedOutError_1.UserAlreadySignedOutError.code, UserAlreadySignedOutError_1.UserAlreadySignedOutError.detail));
            }
            const foundUser = yield this.userRepository.getUserById(payload.id);
            const newUser = new User_1.User(String(null), foundUser.name, foundUser.email, foundUser.password);
            const user = yield this.userRepository.updateUserById(payload.id, newUser);
            return ProcessResponse_1.ProcessResponse.Success(user);
        });
    }
}
exports.SignOutUserCommand = SignOutUserCommand;
