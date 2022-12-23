"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
/* eslint-disable prettier/prettier */
const CryptoTS = require('crypto-ts');
const fs = require('fs');
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: '/Users/oscarreinagustafsson/Desktop/Göteborgs Universitet/Distributed Systems/Project/T2-AuthenticationHandler/.env' });
const RSA_PRIVATE_KEY = fs.readFileSync('/Users/oscarreinagustafsson/Desktop/Göteborgs Universitet/Distributed Systems/Project/T2-AuthenticationHandler/jwtRS256.key');
// Encrypt
function encrypt(text) {
    const ciphertext = CryptoTS.AES.encrypt(JSON.stringify(text), RSA_PRIVATE_KEY);
    console.log(ciphertext.toString());
    return ciphertext;
}
exports.encrypt = encrypt;
// Decrypt
function decrypt(encryptedMessage) {
    const bytes = CryptoTS.AES.decrypt(encryptedMessage, RSA_PRIVATE_KEY);
    const decryptedMessage = JSON.parse(bytes.toString(CryptoTS.enc.Utf8));
    console.log(decryptedMessage);
    return decryptedMessage;
}
exports.decrypt = decrypt;
const data = { name: 'Andrea', email: 'andrea@gmail.com', password: '123' };
const data2 = { id: '63a04766d4187330b6b843a5' };
const data3 = { email: 'anton@gmail.com', password: '12342134123' };
console.log(process.env.PRIVATE_KEY);
decrypt(encrypt(data3));
