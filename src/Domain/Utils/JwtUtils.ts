import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config({
  path: '/Users/oscarreinagustafsson/Desktop/Göteborgs Universitet/Distributed Systems/Project/T2-AuthenticationHandler/.env',
});

// Sign jwt
export function signJWT(payload: object) {
  return jwt.sign(payload, String(process.env.PRIVATE_KEY), {
    algorithm: 'RS256',
  });
}

// verify jwt
export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, String(process.env.PUBLIC_KEY));
    return {payload: decoded, expired: false};
  } catch (error: any) {
    return {payload: null, expired: error.message.includes('jwt expired')};
  }
}

// Decode jwt
export function decodeJWT(token: string) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
