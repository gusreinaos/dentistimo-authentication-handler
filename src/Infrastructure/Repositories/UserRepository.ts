/* eslint-disable prettier/prettier */
import {User} from '../../Domain/Entities/User';
import {IUserRepository} from '../../Domain/Intefaces/IUserRepository';
import UserSchema from '../Models/UserSchema';

export class UserRepository implements IUserRepository {

  async getUserById(id: string): Promise<User | null> {
    return await UserSchema.findOne({_id: id});
  }
  async getUserByAccessToken(jwt: string): Promise <User | null> {
    return await UserSchema.findOne({jwt: jwt});
  }
  async createUser(user: User): Promise<User | null> {
    return await UserSchema.create(user);
  }
  async updateUser(user: User): Promise <User | null> {
    return await UserSchema.findOneAndUpdate({email: user.email}, user);
  }
}
