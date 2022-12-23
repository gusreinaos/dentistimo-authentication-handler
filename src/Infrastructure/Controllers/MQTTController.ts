/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
import mqtt, {IClientOptions} from 'mqtt'
import {SignInUserCommand} from '../../Application/Commands/SignInUserCommand';
import {SignOutUserCommand} from '../../Application/Commands/SignOutUserCommand';
import {SignUpUserCommand} from '../../Application/Commands/SignUpUserCommand';
import {AuthenticateUserQuery} from '../../Application/Queries/AuthenticateUserQuery';

import CircuitBreaker = require('opossum')

import * as dotenv from 'dotenv';

dotenv.config({ path: '/Users/oscarreinagustafsson/Desktop/Göteborgs Universitet/Distributed Systems/Project/T2-AuthenticationHandler/.env' });

export class MQTTController {

    constructor(readonly signInUserCommand: SignInUserCommand,
                readonly signUpUserCommand: SignUpUserCommand,
                readonly signOutUserCommand: SignOutUserCommand,
                readonly authenticateUserQuery: AuthenticateUserQuery,){}

    readonly options: IClientOptions = {
        port: 8883,
        host: 'e960f016875b4c75857353c7f267d899.s2.eu.hivemq.cloud',
        protocol: 'mqtts',
        username: 'gusasarkw@student.gu.se',
        password: 'Twumasi123.'
    }

    readonly circuitBreakerOptions = {
        timeout: 1000,
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

                        signInBreaker.fallback(() => {
                            console.log('System is down')
                        });

                        const result = await signInBreaker.fire(message.toString())

                        if (signInBreaker.stats.fallbacks > 0) {
                            this.client.publish(this.signInResponse, JSON.stringify({message:'CircuitBreaker activated'}))
                        }
                        else {
                            this.client.publish(this.signInResponse, JSON.stringify(result))
                        }
                      }

                    catch (error) {
                        console.log(error)
                    }
                }

                //Request for signing up
                else if (topic === this.signUpRequest) {

                    const signUpBreaker = new CircuitBreaker((encryptedMessage: string) => {
                        return this.signUpUserCommand.execute(encryptedMessage);
                      }, this.circuitBreakerOptions)

                    try {

                        signUpBreaker.fallback(() => {
                            console.log('System is down')
                        });

                        const result = await signUpBreaker.fire(message.toString())

                        if (signUpBreaker.stats.fallbacks > 0) {
                            this.client.publish(this.signInResponse, JSON.stringify({message:'CircuitBreaker activated'}))
                        }

                        else {
                            this.client.publish(this.signInResponse, JSON.stringify(result))
                        }
                      }

                    catch (error) {
                        console.log(error)
                    }
                }

                //Request for signing out
                else if (topic === this.signOutRequest) {

                    const signOutBreaker = new CircuitBreaker((encryptedMessage: string) => {
                        return this.signOutUserCommand.execute(encryptedMessage);
                      }, this.circuitBreakerOptions)

                    try {

                        signOutBreaker.fallback(() => {
                            console.log('System is down')
                        });

                        const result = await signOutBreaker.fire(message.toString())

                        if (signOutBreaker.stats.fallbacks > 0) {
                            this.client.publish(this.signOutResponse, JSON.stringify({message:'CircuitBreaker activated'}))
                        }

                        else {
                            this.client.publish(this.signOutResponse, JSON.stringify(result))
                        }
                      }

                    catch (error) {
                        console.log(error)
                    }
                }

                //Request for authorisation of use case
                else if (topic === this.appointmentAuthRequest) {

                    const authenticateUserBreaker = new CircuitBreaker((encryptedMessage: string) => {
                        return this.authenticateUserQuery.execute(encryptedMessage);
                      }, this.circuitBreakerOptions)

                    try {

                        authenticateUserBreaker.fallback(() => {
                            console.log('System is down')
                        });

                        const receivedMessage = JSON.parse(message.toString())
                        const userExists = await this.authenticateUserQuery.execute(receivedMessage.jwt)

                        if (authenticateUserBreaker.stats.fallbacks > 0) {
                            this.client.publish(this.signOutResponse, JSON.stringify({message:'CircuitBreaker activated'}))
                        }

                        else {

                            if (userExists === true) {
                                const response = delete receivedMessage.jwt;
                                this.client.publish(this.appointmentRequest, response.toString())
                                this.client.publish(this.appointmentAuthResponse, userExists.toString())
                            }

                            else {
                                this.client.publish(this.appointmentAuthRequest, userExists.toString())
                            }
                        }
                      }

                    catch (error) {
                        console.log(error)
                    }
                }
            })
        })
    }
}
