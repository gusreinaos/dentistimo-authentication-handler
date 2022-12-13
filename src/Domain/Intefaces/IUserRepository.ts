/* eslint-disable prettier/prettier */
import {User} from '../Entities/User';
import { IUser } from './IUser';

export interface IUserRepository {
  getUser(email: string, password: string): Promise<User | null>;
  getUserByAccessToken(jwt: string): Promise <User | null>
  createUser(user: IUser): Promise<User | null>;
  updateUser(user: User): Promise <User | null>;
}
