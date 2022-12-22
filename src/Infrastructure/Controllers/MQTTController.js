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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTTController = void 0;
/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
const mqtt_1 = __importDefault(require("mqtt"));
const CircuitBreaker = require("opossum");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: '/Users/oscarreinagustafsson/Desktop/Göteborgs Universitet/Distributed Systems/Project/T2-AuthenticationHandler/.env' });
class MQTTController {
    constructor(signInUserCommand, signUpUserCommand, signOutUserCommand, authenticateUserQuery) {
        this.signInUserCommand = signInUserCommand;
        this.signUpUserCommand = signUpUserCommand;
        this.signOutUserCommand = signOutUserCommand;
        this.authenticateUserQuery = authenticateUserQuery;
        this.options = {
            port: 8883,
            host: '80a9b426b200440c81e9c17c2ba85bc2.s2.eu.hivemq.cloud',
            protocol: 'mqtts',
            username: 'gusreinaos',
            password: 'Mosquitto1204!'
        };
        this.circuitBreakerOptions = {
            timeout: 1000,
            errorThresholdPercentage: 50,
            resetTimeout: 5000
        };
        this.client = mqtt_1.default.connect(this.options);
        this.authenticationRequest = 'authentication/#';
        this.signInRequest = 'authentication/signIn/request';
        this.signInResponse = 'authentication/signIn/response';
        this.signUpRequest = 'authentication/signUp/request';
        this.signUpResponse = 'authentication/signUp/response';
        this.signOutRequest = 'authentication/signOut/request';
        this.signOutResponse = 'authentication/signOut/response';
        this.appointmentAuthRequest = 'authentication/appointment/request';
        this.appointmentAuthResponse = 'authentication/appointment/response';
        this.appointmentRequest = 'appointment/request';
    }
    connect() {
        this.client.on('connect', () => {
            console.log('Client is connected to the internet');
            this.client.subscribe(this.authenticationRequest, { qos: 1 });
            console.log('Client has subscribed successfully');
            this.client.on('message', (topic, message) => __awaiter(this, void 0, void 0, function* () {
                //Request for signing in
                if (topic === this.signInRequest) {
                    const signInBreaker = new CircuitBreaker((encryptedMessage) => {
                        return this.signInUserCommand.execute(encryptedMessage);
                    }, this.circuitBreakerOptions);
                    try {
                        signInBreaker.fallback(() => {
                            console.log('System is down');
                        });
                        const result = yield signInBreaker.fire(message.toString());
                        if (signInBreaker.stats.fallbacks > 0) {
                            this.client.publish(this.signInResponse, 'Error');
                        }
                        else {
                            this.client.publish(this.signInResponse, JSON.stringify(result));
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                //Request for signing up
                else if (topic === this.signUpRequest) {
                    const user = yield this.signUpUserCommand.execute(message.toString());
                    this.client.publish(this.signUpResponse, JSON.stringify(user));
                    console.log(user);
                }
                //Request for signing out
                else if (topic === this.signOutRequest) {
                    const user = yield this.signOutUserCommand.execute(message.toString());
                    this.client.publish(this.signOutResponse, JSON.stringify(user));
                }
                //Request for authorisation of use case
                else if (topic === this.appointmentAuthRequest) {
                    const receivedMessage = JSON.parse(message.toString());
                    const userExists = yield this.authenticateUserQuery.execute(receivedMessage.jwt);
                    if (userExists === true) {
                        const response = delete receivedMessage.jwt;
                        this.client.publish(this.appointmentRequest, response.toString());
                        this.client.publish(this.appointmentAuthResponse, userExists.toString());
                    }
                    else {
                        this.client.publish(this.appointmentAuthRequest, userExists.toString());
                    }
                }
            }));
        });
    }
}
exports.MQTTController = MQTTController;
