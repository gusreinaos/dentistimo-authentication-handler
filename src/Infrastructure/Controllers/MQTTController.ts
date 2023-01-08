/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
import mqtt, {IClientOptions} from 'mqtt'
import {SignInUserCommand} from '../../Application/Commands/SignInUserCommand';
import {SignOutUserCommand} from '../../Application/Commands/SignOutUserCommand';
import {SignUpUserCommand} from '../../Application/Commands/SignUpUserCommand';
import {AuthenticateUserQuery} from '../../Application/Queries/AuthenticateUserQuery';

import CircuitBreaker from 'opossum'

import * as dotenv from 'dotenv';
import { Response } from '../../Domain/Responses/FlowResponse/Response';

dotenv.config({ path: '../../../.env' });

export class MQTTController {

    constructor(readonly signInUserCommand: SignInUserCommand,
                readonly signUpUserCommand: SignUpUserCommand,
                readonly signOutUserCommand: SignOutUserCommand,
                readonly authenticateUserQuery: AuthenticateUserQuery){}
    //This is on standby due to complications in testing circuitbreaker
    /*readonly mqttoptions: IClientOptions = {
        port: 8883,
        host: 'cb9fe4f292fe4099ae5eeb9f230c8346.s2.eu.hivemq.cloud',
        protocol: 'mqtts',
        username: 'T2Project',
        password: 'Mamamia1234.'
        }

    */
        
        
                
    options: CircuitBreaker.Options = {
        timeout: 100, // If our function takes longer than 3 seconds, trigger a failure
        errorThresholdPercentage: 50,// When 50% of requests fail, trip the circuit
        resetTimeout: 5000 // After 30 seconds, try again.
        };   
   
   
    readonly client = mqtt.connect('mqtt://broker.hivemq.com',{
        port: 1883,
        username: 'T2Project',
        password: 'Mamamia1234.',

    });
    
    

    //readonly client = mqtt.connect(this.mqttoptions);

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
    readonly appointmentResponse = 'appointment/response'

    readonly userInformationRequest = 'information/request'
    readonly userInformationResponse = 'information/response'

    executionTimes:number[]  = [];
    
    public connect() {
        
        let counter = 0;
        this.client.on('connect', () => {
            console.log('Client is connected to the internet');

            this.client.subscribe(this.authenticationRequest, {qos: 2})
            this.client.subscribe(this.appointmentResponse, {qos: 1})

            console.log('Client has subscribed successfully')

            this.client.on('message', async (topic, message) => {


                //Request for signing in
                if (topic === this.signInRequest) {
                    
                   
                    const signInBreaker: CircuitBreaker = new CircuitBreaker((encryptedMessage: string) => {
                        return this.signInUserCommand.functionThatWouldFail(encryptedMessage);
                    }, this.options)
                    
                    try {
                        
                       
                        signInBreaker.on('timeout', () => console.log('timeout') );
                        signInBreaker.on('reject', () => console.log('reject'));
                        signInBreaker.on('open', () => console.log('open'));
                        //signInBreaker.on('halfOpen', () => console.log('halfOpen'));
                        signInBreaker.on('close', () => console.log('close'));
                        signInBreaker.fallback(() => 'Sorry, out of service right now');
                        signInBreaker.on('fallback', () => console.log('Sorry, out of service right now'));

                        const response = await signInBreaker.fire(message.toString())
                       
                        this.client.publish(this.signInResponse, JSON.stringify(response), {qos: 1})
                    
                        
                    }

                    catch (error) {
                        console.log(error)
                    }                   
                    
                }
                
                //Request for signing up
                else if (topic === this.signUpRequest) {

                    const signUpBreaker = new CircuitBreaker((encryptedMessage: string) => {
                        return this.signUpUserCommand.execute(encryptedMessage);
                    }, this.options)

                   
                    try {
                        
                        
                        signUpBreaker.on('timeout', () => console.log('timeout') );
                        signUpBreaker.on('reject', () => console.log('reject'));
                        signUpBreaker.on('open', () => console.log('open'));
                        signUpBreaker.on('halfOpen', () => console.log('Circuitbreaker is closed'));
                        signUpBreaker.on('close', () => console.log('Circuitbreaker is closed'));
                        signUpBreaker.fallback(() => 'Sorry, out of service right now');
                        signUpBreaker.on('fallback', () => console.log('Sorry, out of service right now'));

                        const response = await signUpBreaker.fire(message.toString())
                       
                        this.client.publish(this.signUpResponse, JSON.stringify(response), {qos:1})
                    
                        
                    }

                    catch (error) {
                        console.log(error)
                    }
                   
                }

                //Request for signing out
                else if (topic === this.signOutRequest) {
                    
                    const signOutBreaker = new CircuitBreaker((encryptedMessage: string) => {
                        return this.signOutUserCommand.execute(encryptedMessage);
                      }, this.options)

                   
                      try {
                        
                        
                        signOutBreaker.on('timeout', () => console.log('timeout') );
                        signOutBreaker.on('open', () => console.log('open'));
                        
                        signOutBreaker.on('close', () => console.log('close'));
                        signOutBreaker.fallback(() => 'Sorry, out of service right now');
                        signOutBreaker.on('fallback', () => console.log('Sorry, out of service right now'));

                        const response = await signOutBreaker.fire(message.toString())
                      
                        
                     
                        this.client.publish(this.signOutResponse, JSON.stringify(response), {qos:1})
                    
                        
                    }

                    catch (error) {
                        console.log(error)
                    }
                   
                }

                //Request for authorisation of use case
                else if (topic === this.appointmentAuthRequest) {
                    
            
                    const authenticateUserBreaker = new CircuitBreaker((encryptedMessage: string) => {
                        return this.authenticateUserQuery.execute(encryptedMessage);
                    }, this.options)

                    try {
                        
                      
                        authenticateUserBreaker.on('timeout', () => console.log('timeout') );
                        authenticateUserBreaker.on('reject', () => console.log('reject'));
                        authenticateUserBreaker.on('open', () => console.log('open'));
                        //authenticateUserBreaker.on('halfOpen', () => console.log('halfOpen'));
                        authenticateUserBreaker.on('close', () => console.log('close'));
                        authenticateUserBreaker.fallback(() => 'Sorry, out of service right now');
                        authenticateUserBreaker.on('fallback', () => console.log('Sorry, out of service right now'));

                        const response = await authenticateUserBreaker.fire(message.toString())
                        
                       
                        if (response.isSuccess) {
                            //console.log('executed')
                            this.client.publish(this.appointmentRequest, message.toString())
                            this.client.publish(this.appointmentAuthResponse, JSON.stringify(response))
                        }

                        else {
                            this.client.publish(this.appointmentAuthResponse, JSON.stringify(response), {qos:1})
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
