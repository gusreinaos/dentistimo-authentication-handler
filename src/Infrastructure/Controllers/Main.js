"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable prettier/prettier */
const MQTTController_1 = require("./MQTTController");
const mongoose_1 = __importDefault(require("mongoose"));
const UserRepository_1 = require("../Repositories/UserRepository");
const SignInUserCommand_1 = require("../../Application/Commands/SignInUserCommand");
const SignUpUserCommand_1 = require("../../Application/Commands/SignUpUserCommand");
const SignOutUserCommand_1 = require("../../Application/Commands/SignOutUserCommand");
const AuthenticateUserQuery_1 = require("../../Application/Queries/AuthenticateUserQuery");
const ValidateUserService_1 = require("../../Domain/Services/Validations/ValidateUserService");
const ValidateUserTokenService_1 = require("../../Domain/Services/Validations/ValidateUserTokenService");
mongoose_1.default.connect('mongodb+srv://gusreinaos:4MNbebz6E04hq5IV@cluster0.x1srwma.mongodb.net/test');
const userRepository = new UserRepository_1.UserRepository();
const validateUserService = new ValidateUserService_1.ValidateUserService(userRepository);
const validateUserTokenService = new ValidateUserTokenService_1.ValidateUserTokenService(userRepository);
const signInUserCommand = new SignInUserCommand_1.SignInUserCommand(userRepository, validateUserService, validateUserTokenService);
const signUpUserCommand = new SignUpUserCommand_1.SignUpUserCommand(userRepository, validateUserService);
const signOutUserCommand = new SignOutUserCommand_1.SignOutUserCommand(userRepository, validateUserService, validateUserTokenService);
const authenticateUserQuery = new AuthenticateUserQuery_1.AuthenticateUserQuery(userRepository, validateUserService, validateUserTokenService);
new MQTTController_1.MQTTController(signInUserCommand, signUpUserCommand, signOutUserCommand, authenticateUserQuery).connect();
