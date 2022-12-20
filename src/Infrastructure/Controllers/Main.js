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
mongoose_1.default.connect('mongodb+srv://gusreinaos:4MNbebz6E04hq5IV@cluster0.x1srwma.mongodb.net/test');
const repository = new UserRepository_1.UserRepository();
const signInUserCommand = new SignInUserCommand_1.SignInUserCommand(repository);
const signUpUserCommand = new SignUpUserCommand_1.SignUpUserCommand(repository);
const signOutUserCommand = new SignOutUserCommand_1.SignOutUserCommand(repository);
const authenticateUserQuery = new AuthenticateUserQuery_1.AuthenticateUserQuery(repository);
new MQTTController_1.MQTTController(signInUserCommand, signUpUserCommand, signOutUserCommand, authenticateUserQuery).connect();
