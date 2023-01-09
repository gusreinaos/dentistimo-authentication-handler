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
exports.AuthenticateUserQuery = void 0;
const ProcessResponse_1 = require("../../Domain/Responses/FlowResponse/ProcessResponse");
const ErrorResponse_1 = require("../../Domain/Responses/FlowResponse/ErrorResponse");
const UserNotFoundError_1 = require("../../Domain/Errors/UserNotFoundError");
const UnerNotAuthenticatedError_1 = require("../../Domain/Errors/UnerNotAuthenticatedError");
class AuthenticateUserQuery {
    constructor(userRepository, validateUserService, validateUserTokenService) {
        this.userRepository = userRepository;
        this.validateUserService = validateUserService;
        this.validateUserTokenService = validateUserTokenService;
    }
    execute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = JSON.parse(payload);
            const userExists = yield this.validateUserService.validateId(message.userId);
            if (!userExists) {
                return ProcessResponse_1.ProcessResponse.Error(new ErrorResponse_1.ErrorResponse(UserNotFoundError_1.UserNotFoundError.code, UserNotFoundError_1.UserNotFoundError.detail));
            }
            const tokenExists = yield this.validateUserTokenService.validateId(message.userId);
            if (!tokenExists) {
                return ProcessResponse_1.ProcessResponse.Error(new ErrorResponse_1.ErrorResponse(UnerNotAuthenticatedError_1.UserNotAuthenticatedError.code, UnerNotAuthenticatedError_1.UserNotAuthenticatedError.detail));
            }
            const user = yield this.userRepository.getUserById(message.id);
            return ProcessResponse_1.ProcessResponse.Success(user);
        });
    }
}
exports.AuthenticateUserQuery = AuthenticateUserQuery;
