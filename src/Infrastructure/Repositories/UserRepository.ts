/* eslint-disable prettier/prettier */
import {User} from '../../Domain/Entities/User';
import { IUser } from '../../Domain/Intefaces/IUser';
import {IUserRepository} from '../../Domain/Intefaces/IUserRepository';
import UserSchema from '../Models/UserSchema';

export class UserRepository implements IUserRepository {

  async getUser(email: string, password: string): Promise<User | null> {
    return await UserSchema.findOne({email: email, password: password});
  }
  async createUser(user: IUser): Promise<User | null> {
    return await UserSchema.create(user);
  }
}
