/* eslint-disable prettier/prettier */
import {MQTTController} from './MQTTController';
import mongoose from 'mongoose';
import {UserRepository} from '../Repositories/UserRepository';
import {SignInUserCommand} from '../../Application/Commands/SignInUserCommand';
import {SignUpUserCommand} from '../../Application/Commands/SignUpUserCommand';
import {SignOutUserCommand} from '../../Application/Commands/SignOutUserCommand';
import {AuthenticateUserQuery} from '../../Application/Queries/AuthenticateUserQuery';

mongoose.connect(
  'mongodb+srv://gusreinaos:4MNbebz6E04hq5IV@cluster0.x1srwma.mongodb.net/test'
);

const repository = new UserRepository();
const signInUserCommand = new SignInUserCommand(repository);
const signUpUserCommand = new SignUpUserCommand(repository);
const signOutUserCommand = new SignOutUserCommand(repository);
const authenticateUserQuery = new AuthenticateUserQuery(repository);

new MQTTController(signInUserCommand, signUpUserCommand, signOutUserCommand, authenticateUserQuery).connect();
