"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTTController = void 0;
/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
const mqtt_1 = __importDefault(require("mqtt"));
class MQTTController {
    constructor(createUserCommand) {
        this.createUserCommand = createUserCommand;
        this.options = {
            port: 8883,
            host: '80a9b426b200440c81e9c17c2ba85bc2.s2.eu.hivemq.cloud',
            protocol: 'mqtts',
            username: 'gusreinaos',
            password: 'Mosquitto1204!'
        };
        this.client = mqtt_1.default.connect(this.options);
        this.authenticationRequest = 'authentication/#';
        this.signInRequest = 'authentication/signIn/request';
        this.signInResponse = 'authentication/signIn/response';
        this.signUpRequest = 'authentication/signUp/request';
        this.signUpResponse = 'authentication/signUp/response';
        this.appointmentAuthRequest = 'authentication/appointment/request';
        this.appointmentAuthResponse = 'authentication/appointment/response';
        this.appointment = '';
    }
    connect() {
        this.client.on('connect', () => {
            console.log('Client is connected to the internet');
            this.client.subscribe(this.authenticationRequest, { qos: 1 });
            console.log('Client has subscribed successfully');
            this.client.on('message', (topic, message) => {
                if (topic === this.signUpRequest) {
                    const user = this.createUserCommand.execute(message.toString());
                    this.client.publish(this.signUpResponse, user.toString());
                }
            });
        });
    }
}
exports.MQTTController = MQTTController;
