/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
import mqtt, {IClientOptions} from 'mqtt'
import {SignInUserCommand} from '../../Application/Commands/SignInUserCommand';
import {SignOutUserCommand} from '../../Application/Commands/SignOutUserCommand';
import {SignUpUserCommand} from '../../Application/Commands/SignUpUserCommand';
import {AuthenticateUserQuery} from '../../Application/Queries/AuthenticateUserQuery';

import CircuitBreaker = require('opossum')

import * as dotenv from 'dotenv';

dotenv.config({ path: '../../../.env' });

export class MQTTController {

    constructor(readonly signInUserCommand: SignInUserCommand,
                readonly signUpUserCommand: SignUpUserCommand,
                readonly signOutUserCommand: SignOutUserCommand,
                readonly authenticateUserQuery: AuthenticateUserQuery){}

    readonly options: IClientOptions = {
        port: 8883,
        host: 'cb9fe4f292fe4099ae5eeb9f230c8346.s2.eu.hivemq.cloud',
        protocol: 'mqtts',
        username: 'T2Project',
        password: 'Mamamia1234.'
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

    readonly userInformationRequest = 'information/request'
    readonly userInformationResponse = 'information/response'

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

                        const response = await signInBreaker.fire(message.toString())

                        if (signInBreaker.stats.fallbacks > 0) {
                            this.client.publish(this.signInResponse, JSON.stringify({message:'CircuitBreaker activated'}))
                        }
                        else {
                            this.client.publish(this.signInResponse, JSON.stringify(response))
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

                        const response = await signUpBreaker.fire(message.toString())

                        if (signUpBreaker.stats.fallbacks > 0) {
                            this.client.publish(this.signInResponse, JSON.stringify({message:'CircuitBreaker activated'}))
                        }

                        else {
                            this.client.publish(this.signInResponse, JSON.stringify(response))
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

                        const response = await signOutBreaker.fire(message.toString())

                        if (signOutBreaker.stats.fallbacks > 0) {
                            this.client.publish(this.signOutResponse, JSON.stringify({message:'CircuitBreaker activated'}))
                        }

                        else {
                            this.client.publish(this.signOutResponse, JSON.stringify(response))
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
                        const response = await this.authenticateUserQuery.execute(message.toString())


                        if (authenticateUserBreaker.stats.fallbacks > 0) {
                            this.client.publish(this.signOutResponse, JSON.stringify({message:'CircuitBreaker activated'}))
                        }

                        else {

                            if (response.isSuccess) {
                                this.client.publish(this.appointmentRequest, message.toString())
                                this.client.publish(this.appointmentAuthResponse, JSON.stringify(response))
                            }

                            else {
                                this.client.publish(this.appointmentAuthResponse, JSON.stringify(response))
                            }
                            console.log(response)
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
