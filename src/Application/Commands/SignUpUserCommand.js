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
exports.SignUpUserCommand = void 0;
/* eslint-disable prettier/prettier */
const User_1 = require("../../Domain/Entities/User");
const CryptoUtils_1 = require("../../Domain/Utils/CryptoUtils");
const ProcessResponse_1 = require("../../Domain/Responses/FlowResponse/ProcessResponse");
const ErrorResponse_1 = require("../../Domain/Responses/FlowResponse/ErrorResponse");
const UserAlreadyExistsError_1 = require("../../Domain/Errors/UserAlreadyExistsError");
class SignUpUserCommand {
    constructor(userRepository, validateUserService) {
        this.userRepository = userRepository;
        this.validateUserService = validateUserService;
    }
    execute(encryptedMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = (0, CryptoUtils_1.decrypt)(encryptedMessage);
            const userExists = yield this.validateUserService.validateEmail(payload.email);
            if (userExists) {
                return ProcessResponse_1.ProcessResponse.Error(new ErrorResponse_1.ErrorResponse(UserAlreadyExistsError_1.UserAlreadyExistsError.code, UserAlreadyExistsError_1.UserAlreadyExistsError.detail));
            }
            const user = new User_1.User('null', payload.name, payload.email, payload.password);
            const newUser = yield this.userRepository.createUser(user);
            return ProcessResponse_1.ProcessResponse.Success(newUser);
        });
    }
}
exports.SignUpUserCommand = SignUpUserCommand;
