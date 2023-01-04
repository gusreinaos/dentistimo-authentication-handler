/* eslint-disable prettier/prettier */
import {MQTTController} from './MQTTController';
import mongoose from 'mongoose';
import {UserRepository} from '../Repositories/UserRepository';
import {SignInUserCommand} from '../../Application/Commands/SignInUserCommand';
import {SignUpUserCommand} from '../../Application/Commands/SignUpUserCommand';
import {SignOutUserCommand} from '../../Application/Commands/SignOutUserCommand';
import {AuthenticateUserQuery} from '../../Application/Queries/AuthenticateUserQuery';
import { ValidateUserService } from '../../Domain/Services/Validations/ValidateUserService';
import { ValidateUserTokenService } from '../../Domain/Services/Validations/ValidateUserTokenService';

mongoose.connect(
  'mongodb+srv://gusreinaos:4MNbebz6E04hq5IV@cluster0.x1srwma.mongodb.net/test'
);

const userRepository = new UserRepository();
const validateUserService = new ValidateUserService(userRepository);
const validateUserTokenService = new ValidateUserTokenService(userRepository)
const signInUserCommand = new SignInUserCommand(userRepository, validateUserService, validateUserTokenService);
const signUpUserCommand = new SignUpUserCommand(userRepository, validateUserService);
const signOutUserCommand = new SignOutUserCommand(userRepository, validateUserService, validateUserTokenService);
const authenticateUserQuery = new AuthenticateUserQuery(userRepository);

new MQTTController(signInUserCommand, signUpUserCommand, signOutUserCommand, authenticateUserQuery).connect();
