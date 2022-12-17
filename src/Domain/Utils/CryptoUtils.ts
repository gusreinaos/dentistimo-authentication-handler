/* eslint-disable prettier/prettier */
const CryptoTS = require('crypto-ts');
const fs = require('fs')
import * as dotenv from 'dotenv';

dotenv.config({ path: '/Users/oscarreinagustafsson/Desktop/Göteborgs Universitet/Distributed Systems/Project/T2-AuthenticationHandler/.env' });

const RSA_PRIVATE_KEY = fs.readFileSync(
  '/Users/oscarreinagustafsson/Desktop/Göteborgs Universitet/Distributed Systems/Project/T2-AuthenticationHandler/jwtRS256.key'
);


// Encrypt

export function encrypt(text: string) {
  const ciphertext = CryptoTS.AES.encrypt(JSON.stringify(text), RSA_PRIVATE_KEY)
  return ciphertext;
}

// Decrypt
export function decrypt(encryptedMessage: string){
  const bytes = CryptoTS.AES.decrypt(encryptedMessage.toString(), RSA_PRIVATE_KEY);
  const decryptedMessage = JSON.parse(bytes.toString(CryptoTS.enc.Utf8))
  return decryptedMessage;
}


