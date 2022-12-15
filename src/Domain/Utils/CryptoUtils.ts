/* eslint-disable prettier/prettier */
import CryptoJS from 'crypto-js';

import * as dotenv from 'dotenv';

dotenv.config({
  path: '/Users/oscarreinagustafsson/Desktop/Göteborgs Universitet/Distributed Systems/Project/T2-AuthenticationHandler/.env',
});

// Encrypt
export function encrypt(text: string) {
  return CryptoJS.AES.encrypt(JSON.stringify(text), String(process.env.PRIVATE_KEY)).toString();
}

// Decrypt
export function decrypt(text: string) {
    const bytes = CryptoJS.AES.decrypt(text, String(process.env.PRIVATE_KEY));
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
