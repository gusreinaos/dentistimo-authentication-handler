import {ISession} from '../Intefaces/ISession';

export type PartialSession = Omit<ISession, 'issued' | 'expires'>;
