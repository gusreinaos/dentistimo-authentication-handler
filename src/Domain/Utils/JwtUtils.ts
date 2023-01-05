/* eslint-disable prettier/prettier */
import jwt from 'jsonwebtoken';
const fs = require('fs');
import * as dotenv from 'dotenv';

dotenv.config({
  path: '../../../.env',
});

const RSA_PRIVATE_KEY = {
  key: fs.readFileSync('../../../jwtRS256.key'),
  passphrase: String(process.env.PASSWORD_JWT),
};

// Sign jwt
export function signJWT(payload: object) {
  return jwt.sign(payload, RSA_PRIVATE_KEY, {
    algorithm: 'RS256',
  });
}

// verify jwt
export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, '1234');
    return {payload: decoded, expired: false};
  } catch (error: any) {
    return {payload: null, expired: error.message.includes('jwt expired')};
  }
}

// Decode jwt
export function decodeJWT(token: string) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
