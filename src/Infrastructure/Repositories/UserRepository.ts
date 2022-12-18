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
  async getUserByEmailAndPassword(email: string, password: string): Promise <User | null>{
    return await UserSchema.findOne({email: email, password: password})
  }
  async createUser(user: User): Promise<User | null> {
    return await UserSchema.create(user);
  }
  async updateUser(id: string, user: User): Promise <User | null> {
    return await UserSchema.findOneAndUpdate({_id: id}, user);
  }
}
