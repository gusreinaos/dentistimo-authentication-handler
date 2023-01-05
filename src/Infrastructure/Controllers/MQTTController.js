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
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: '../../../.env' });
class MQTTController {
    constructor(signInUserCommand, signUpUserCommand, signOutUserCommand, authenticateUserQuery) {
        this.signInUserCommand = signInUserCommand;
        this.signUpUserCommand = signUpUserCommand;
        this.signOutUserCommand = signOutUserCommand;
        this.authenticateUserQuery = authenticateUserQuery;
        this.options = {
            port: 8883,
            host: 'cb9fe4f292fe4099ae5eeb9f230c8346.s2.eu.hivemq.cloud',
            protocol: 'mqtts',
            username: process.env.USERNAME_MQTT,
            password: process.env.PASSWORD_MQTT,
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
        this.userInformationRequest = 'information/request';
        this.userInformationResponse = 'information/response';
    }
    connect() {
        this.client.on('connect', () => {
            console.log('Client is connected to the internet');
            this.client.subscribe(this.authenticationRequest, { qos: 1 });
            console.log('Client has subscribed successfully');
            this.client.on('message', (topic, message) => __awaiter(this, void 0, void 0, function* () {
                //Request for signing in
                if (topic === this.signInRequest) {
                    const response = yield this.signInUserCommand.execute(message.toString());
                    this.client.publish(this.signInResponse, JSON.stringify(response));
                    console.log(response);
                }
                //Request for signing up
                else if (topic === this.signUpRequest) {
                    const response = yield this.signUpUserCommand.execute(message.toString());
                    this.client.publish(this.signUpResponse, JSON.stringify(response));
                    console.log(response);
                }
                //Request for signing out
                else if (topic === this.signOutRequest) {
                    const response = yield this.signOutUserCommand.execute(message.toString());
                    this.client.publish(this.signOutResponse, JSON.stringify(response));
                    console.log(response);
                }
                //Request for authorisation of use case
                else if (topic === this.appointmentAuthRequest) {
                    const response = yield this.authenticateUserQuery.execute(message.toString());
                    if (response.isSuccess) {
                        this.client.publish(this.appointmentRequest, message.toString());
                        this.client.publish(this.appointmentAuthResponse, JSON.stringify(response));
                    }
                    else {
                        this.client.publish(this.appointmentAuthResponse, JSON.stringify(response));
                    }
                    console.log(response);
                }
            }));
        });
    }
}
exports.MQTTController = MQTTController;
