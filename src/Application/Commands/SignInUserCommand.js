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
const JwtUtils_1 = require("../../Domain/Utils/JwtUtils");
class SignInUserCommand {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(jwt) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = (0, JwtUtils_1.decodeJWT)(jwt);
            const foundUser = this.userRepository.getUser(payload.email, payload.password);
            if (foundUser === null) {
                return null;
            }
            const newUser = new User_1.User(jwt, payload.name, payload.email, payload.password);
            return this.userRepository.updateUser(newUser);
        });
    }
}
exports.SignInUserCommand = SignInUserCommand;
