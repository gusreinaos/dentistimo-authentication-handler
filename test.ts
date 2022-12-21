/* eslint-disable prettier/prettier */
const CryptoTS = require('crypto-ts');
const fs = require('fs')
import * as dotenv from 'dotenv';

dotenv.config({ path: '/Users/oscarreinagustafsson/Desktop/Göteborgs Universitet/Distributed Systems/Project/T2-AuthenticationHandler/.env' });

const RSA_PRIVATE_KEY = fs.readFileSync(
  '/Users/oscarreinagustafsson/Desktop/Göteborgs Universitet/Distributed Systems/Project/T2-AuthenticationHandler/jwtRS256.key'
);

// Encrypt
export function encrypt(text: object) {
  const ciphertext = CryptoTS.AES.encrypt(JSON.stringify(text), RSA_PRIVATE_KEY)
  console.log(ciphertext.toString())
  return ciphertext;
}

// Decrypt
export function decrypt(encryptedMessage: string){
  const bytes = CryptoTS.AES.decrypt(encryptedMessage, RSA_PRIVATE_KEY);
  const decryptedMessage = JSON.parse(bytes.toString(CryptoTS.enc.Utf8))
  console.log(decryptedMessage)
  return decryptedMessage;
}


const data = {name: 'Andrea',email: 'andrea@gmail.com',password: '123'}

const data2 = {id: '63a04766d4187330b6b843a5'}

const data3 = {email: 'anton@gmail.com', password: '12342134123'}

console.log(process.env.PRIVATE_KEY)

decrypt(encrypt(data3))

