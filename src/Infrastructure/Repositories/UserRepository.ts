/* eslint-disable prettier/prettier */
import {User} from '../../Domain/Entities/User';
import { IUser } from '../../Domain/Intefaces/IUser';
import {IUserRepository} from '../../Domain/Intefaces/IUserRepository';
import UserSchema from '../Models/UserSchema';

export class UserRepository implements IUserRepository {

  async getUser(email: string, password: string): Promise<User | null> {
    return await UserSchema.findOne({email: email, password: password});
  }
  async getUserByAccessToken(jwt: string): Promise <User | null> {
    return await UserSchema.findOne({jwt: jwt});
  }
  async createUser(user: IUser): Promise<User | null> {
    return await UserSchema.create(user);
  }
  async updateUser(user: User): Promise <User | null> {
    return await UserSchema.findOneAndUpdate({email: user.email}, user);
  }
}
