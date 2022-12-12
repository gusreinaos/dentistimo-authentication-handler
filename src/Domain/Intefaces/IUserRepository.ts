/* eslint-disable prettier/prettier */
import {User} from '../Entities/User';

export interface IUserRepository {
  getUser(email: string, password: string): Promise<User | null>;
  createUser(jwtToken: string, name: string, email: string, password: string): Promise<User | null>;
}
