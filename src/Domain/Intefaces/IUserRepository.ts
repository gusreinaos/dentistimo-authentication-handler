/* eslint-disable prettier/prettier */
import {User} from '../Entities/User';
import { IUser } from './IUser';

export interface IUserRepository {
  getUserById(id: string): Promise<User | null>
  getUserByAccessToken(jwt: string): Promise <User | null>
  getUserByEmail(email: string): Promise <User | null>
  getUserByEmailAndPassword(email: string, password: string): Promise <User | null>
  createUser(user: IUser): Promise<User>;
  updateUserById(id:string, user: User): Promise <User | null>;
  updateUserByEmail(email: string, user: User): Promise <User | null>;
}
