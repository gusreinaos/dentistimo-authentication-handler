/* eslint-disable prettier/prettier */
import {User} from '../../Domain/Entities/User';
import {IUserRepository} from '../../Domain/Intefaces/IUserRepository';
import UserSchema from '../Models/UserSchema';

export class UserRepository implements IUserRepository {
  async getUser(email: string, password: string): Promise<User | null> {
    return await UserSchema.findOne({email: email, password: password});
  }

  async createUser(jwtToken:string, name: string, email: string, password: string): Promise<User | null> {
    return await UserSchema.create(new User(jwtToken, name, email, password));
  }
}
