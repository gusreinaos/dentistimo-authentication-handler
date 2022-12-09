import {ISession} from '../Intefaces/ISession';

export type DecodeResult =
  | {
      type: 'valid';
      session: ISession;
    }
  | {
      type: 'integrity-error';
    }
  | {
      type: 'invalid-token';
    };
