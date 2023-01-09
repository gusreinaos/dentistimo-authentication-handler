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
const opossum_1 = __importDefault(require("opossum"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: '../../../.env' });
class MQTTController {
    constructor(signInUserCommand, signUpUserCommand, signOutUserCommand, authenticateUserQuery) {
        this.signInUserCommand = signInUserCommand;
        this.signUpUserCommand = signUpUserCommand;
        this.signOutUserCommand = signOutUserCommand;
        this.authenticateUserQuery = authenticateUserQuery;
        //This is on standby due to complications in testing circuitbreaker
        /*readonly mqttoptions: IClientOptions = {
            port: 8883,
            host: 'cb9fe4f292fe4099ae5eeb9f230c8346.s2.eu.hivemq.cloud',
            protocol: 'mqtts',
            username: 'T2Project',
            password: 'Mamamia1234.'
            }
        */
        this.options = {
            timeout: 500,
            errorThresholdPercentage: 50,
            resetTimeout: 5000 // After 30 seconds, try again.
        };
        this.client = mqtt_1.default.connect('mqtt://broker.hivemq.com', {
            port: 1883,
            username: 'T2Project',
            password: 'Mamamia1234.',
        });
        //readonly client = mqtt.connect(this.mqttoptions);
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
        this.appointmentResponse = 'appointment/response';
        this.userInformationRequest = 'information/request';
        this.userInformationResponse = 'information/response';
        this.executionTimes = [];
    }
    connect() {
        const counter = 0;
        this.client.on('connect', () => {
            console.log('Client is connected to the internet');
            this.client.subscribe(this.authenticationRequest, { qos: 2 });
            this.client.subscribe(this.appointmentResponse, { qos: 1 });
            console.log('Client has subscribed successfully');
            this.client.on('message', (topic, message) => __awaiter(this, void 0, void 0, function* () {
                //Request for signing in
                if (topic === this.signInRequest) {
                    const signInBreaker = new opossum_1.default((encryptedMessage) => {
                        return this.signInUserCommand.functionThatWouldFail(encryptedMessage);
                    }, this.options);
                    try {
                        signInBreaker.on('timeout', () => console.log('timeout'));
                        signInBreaker.on('reject', () => console.log('reject'));
                        signInBreaker.on('open', () => console.log('open'));
                        //signInBreaker.on('halfOpen', () => console.log('halfOpen'));
                        signInBreaker.on('close', () => console.log('close'));
                        signInBreaker.fallback(() => 'Sorry, out of service right now');
                        signInBreaker.on('fallback', () => console.log('Sorry, out of service right now'));
                        const response = yield signInBreaker.fire(message.toString());
                        this.client.publish(this.signInResponse, JSON.stringify(response), { qos: 1 });
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                //Request for signing up
                else if (topic === this.signUpRequest) {
                    const signUpBreaker = new opossum_1.default((encryptedMessage) => {
                        return this.signUpUserCommand.execute(encryptedMessage);
                    }, this.options);
                    try {
                        signUpBreaker.on('timeout', () => console.log('timeout'));
                        signUpBreaker.on('reject', () => console.log('reject'));
                        signUpBreaker.on('open', () => console.log('open'));
                        signUpBreaker.on('halfOpen', () => console.log('Circuitbreaker is closed'));
                        signUpBreaker.on('close', () => console.log('Circuitbreaker is closed'));
                        signUpBreaker.fallback(() => 'Sorry, out of service right now');
                        signUpBreaker.on('fallback', () => console.log('Sorry, out of service right now'));
                        const response = yield signUpBreaker.fire(message.toString());
                        if (response.isSuccess) {
                            console.log("-------------------------------");
                            console.log("User Signed Up Successfully: ");
                            console.log(response);
                        }
                        this.client.publish(this.signUpResponse, JSON.stringify(response), { qos: 1 });
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                //Request for signing out
                else if (topic === this.signOutRequest) {
                    const signOutBreaker = new opossum_1.default((encryptedMessage) => {
                        return this.signOutUserCommand.execute(encryptedMessage);
                    }, this.options);
                    try {
                        signOutBreaker.on('timeout', () => console.log('timeout'));
                        signOutBreaker.on('open', () => console.log('open'));
                        signOutBreaker.on('close', () => console.log('close'));
                        signOutBreaker.fallback(() => 'Sorry, out of service right now');
                        signOutBreaker.on('fallback', () => console.log('Sorry, out of service right now'));
                        const response = yield signOutBreaker.fire(message.toString());
                        if (response.isSuccess) {
                            console.log("-------------------------------");
                            console.log("User Signed Out Successfully: ");
                            console.log(response);
                        }
                        this.client.publish(this.signOutResponse, JSON.stringify(response), { qos: 1 });
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                //Request for authorisation of use case
                else if (topic === this.appointmentAuthRequest) {
                    const authenticateUserBreaker = new opossum_1.default((encryptedMessage) => {
                        return this.authenticateUserQuery.execute(encryptedMessage);
                    }, this.options);
                    try {
                        authenticateUserBreaker.on('timeout', () => console.log('timeout'));
                        authenticateUserBreaker.on('reject', () => console.log('reject'));
                        authenticateUserBreaker.on('open', () => console.log('open'));
                        //authenticateUserBreaker.on('halfOpen', () => console.log('halfOpen'));
                        authenticateUserBreaker.on('close', () => console.log('close'));
                        authenticateUserBreaker.fallback(() => 'Sorry, out of service right now');
                        authenticateUserBreaker.on('fallback', () => console.log('Sorry, out of service right now'));
                        const response = yield authenticateUserBreaker.fire(message.toString());
                        if (response.isSuccess) {
                            //console.log('executed')
                            console.log('--------------------------');
                            console.log("Appointment Request Made: ");
                            console.log(response);
                            this.client.publish(this.appointmentRequest, message.toString());
                            this.client.publish(this.appointmentAuthResponse, JSON.stringify(response));
                        }
                        else {
                            this.client.publish(this.appointmentAuthResponse, JSON.stringify(response), { qos: 1 });
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }));
        });
    }
}
exports.MQTTController = MQTTController;
