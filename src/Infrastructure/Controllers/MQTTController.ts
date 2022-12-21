/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
import mqtt, {IClientOptions} from 'mqtt'
import {SignInUserCommand} from '../../Application/Commands/SignInUserCommand';
import {SignOutUserCommand} from '../../Application/Commands/SignOutUserCommand';
import {SignUpUserCommand} from '../../Application/Commands/SignUpUserCommand';
import {AuthenticateUserQuery} from '../../Application/Queries/AuthenticateUserQuery';

import CircuitBreaker = require('opossum')
import TimeoutError = require('opossum')

import * as dotenv from 'dotenv';

dotenv.config({ path: '/Users/oscarreinagustafsson/Desktop/Göteborgs Universitet/Distributed Systems/Project/T2-AuthenticationHandler/.env' });

export class MQTTController {

    constructor(readonly signInUserCommand: SignInUserCommand,
                readonly signUpUserCommand: SignUpUserCommand,
                readonly signOutUserCommand: SignOutUserCommand,
                readonly authenticateUserQuery: AuthenticateUserQuery,){}

    readonly options: IClientOptions = {
        port: 8883,
        host: '80a9b426b200440c81e9c17c2ba85bc2.s2.eu.hivemq.cloud',
        protocol: 'mqtts',
        username: process.env.USERNAME_MQTT,
        password: process.env.PASSWORD_MQTT,
    }

    readonly circuitBreakerOptions = {
        timeout: 500,
        errorThresholdPercentage: 50,
        resetTimeout: 5000
      };

    readonly client = mqtt.connect(this.options);

    readonly authenticationRequest = 'authentication/#'

    readonly signInRequest = 'authentication/signIn/request'
    readonly signInResponse = 'authentication/signIn/response'

    readonly signUpRequest = 'authentication/signUp/request'
    readonly signUpResponse = 'authentication/signUp/response'

    readonly signOutRequest = 'authentication/signOut/request'
    readonly signOutResponse = 'authentication/signOut/response'

    readonly appointmentAuthRequest = 'authentication/appointment/request'
    readonly appointmentAuthResponse = 'authentication/appointment/response'

    readonly appointmentRequest = 'appointment/request'

    public connect() {

        this.client.on('connect', () => {
            console.log('Client is connected to the internet');

            this.client.subscribe(this.authenticationRequest, {qos: 1})

            console.log('Client has subscribed successfully')

            this.client.on('message', async (topic, message) => {

                //Request for signing in
                if (topic === this.signInRequest) {
                    
                    const signInBreaker = new CircuitBreaker((encryptedMessage: string) => {
                        return this.signInUserCommand.execute(encryptedMessage);
                      }, this.circuitBreakerOptions)

                      
                      try {
                        const result = await signInBreaker.fire(message.toString())
                        console.log(result)
                        this.client.publish(this.signInResponse, JSON.stringify(result))
                      } catch (error) {
                        if(error instanceof TimeoutError) {
                            console.log('The function timed out')
                        }
                        else {
                            signInBreaker.on('success', () => {'Circuit breaker activated'})
                            signInBreaker.on('failure', () => {'Circuit breaker failed'})
                            signInBreaker.fallback(() => JSON.stringify({message: 'this service is currently unavailable'}))
                            console.error(error);
                        }
                      }
                      
                    /*const signInBreaker = new CircuitBreaker(this.signInUserCommand.execute, this.circuitBreakerOptions);
                    const user = await signInBreaker.fire(message.toString())

                    signInBreaker.fallback(() => {console.log('Service currently unavailable')})
                    signInBreaker.on('success', () => {'Circuit breaker activated'})
                    signInBreaker.on('failure', () => {'Circuit breaker failed'})
                    */

                   

                }

                //Request for signing up
                else if (topic === this.signUpRequest) {
                    const user = await this.signUpUserCommand.execute(message.toString())
                    this.client.publish(this.signUpResponse, JSON.stringify(user))
                    console.log(user)
                }

                //Request for signing out
                else if (topic === this.signOutRequest) {
                    const user = await this.signOutUserCommand.execute(message.toString())
                    this.client.publish(this.signOutResponse, JSON.stringify(user))
                }

                //Request for authorisation of use case
                else if (topic === this.appointmentAuthRequest) {
                    const receivedMessage = JSON.parse(message.toString())
                    const userExists = await this.authenticateUserQuery.execute(receivedMessage.jwt)

                    if (userExists === true) {
                        const response = delete receivedMessage.jwt;
                        this.client.publish(this.appointmentRequest, response.toString())
                        this.client.publish(this.appointmentAuthResponse, userExists.toString())
                    }

                    else {
                        this.client.publish(this.appointmentAuthRequest, userExists.toString())
                    }
                }
            })
        })
    }
}
