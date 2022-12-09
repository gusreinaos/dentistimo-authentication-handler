import {encode, TAlgorithm} from 'jwt-simple';
import {EncodeResult} from '../Intefaces/IEncondedResult';
import {ISession} from '../Intefaces/ISession';

export function encodeSession(
  secretKey: string,
  partialSession: TPartialSession
): EncodeResult {
  // Always use HS512 to sign the token
  const algorithm: TAlgorithm = 'HS512';
  // Determine when the token should expire
  const issued = Date.now();
  const fifteenMinutesInMs = 15 * 60 * 1000;
  const expires = issued + fifteenMinutesInMs;
  const session: ISession = {
    ...partialSession,
    issued: issued,
    expires: expires,
  };

  return {
    token: encode(session, secretKey, algorithm),
    issued: issued,
    expires: expires,
  };
}
