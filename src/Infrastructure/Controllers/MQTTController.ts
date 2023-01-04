/* eslint-disable no-case-declarations */
/* eslint-disable prettier/prettier */
import mqtt, {IClientOptions} from 'mqtt'
import {SignInUserCommand} from '../../Application/Commands/SignInUserCommand';
import {SignOutUserCommand} from '../../Application/Commands/SignOutUserCommand';
import {SignUpUserCommand} from '../../Application/Commands/SignUpUserCommand';
import {AuthenticateUserQuery} from '../../Application/Queries/AuthenticateUserQuery';
import * as dotenv from 'dotenv';
import { GetUserInformationQuery } from '../../Application/Queries/GetUserInformationQuery';

dotenv.config({ path: '../../../.env' });

export class MQTTController {

    constructor(readonly signInUserCommand: SignInUserCommand,
                readonly signUpUserCommand: SignUpUserCommand,
                readonly signOutUserCommand: SignOutUserCommand,
                readonly authenticateUserQuery: AuthenticateUserQuery,
                readonly getUserInformationQuery: GetUserInformationQuery){}

    readonly options: IClientOptions = {
        port: 8883,
        host: 'cb9fe4f292fe4099ae5eeb9f230c8346.s2.eu.hivemq.cloud',
        protocol: 'mqtts',
        username: process.env.USERNAME_MQTT,
        password: process.env.PASSWORD_MQTT,
    }


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
                    const response = await this.signInUserCommand.execute(message.toString())
                    this.client.publish(this.signInResponse, JSON.stringify(response))
                    console.log(response)
                }

                //Request for signing up
                else if (topic === this.signUpRequest) {
                    const response = await this.signUpUserCommand.execute(message.toString())
                    this.client.publish(this.signUpResponse, JSON.stringify(response))
                    console.log(response)
                }

                //Request for signing out
                else if (topic === this.signOutRequest) {
                    const response = await this.signOutUserCommand.execute(message.toString())
                    this.client.publish(this.signOutResponse, JSON.stringify(response))
                    console.log(response)
                }

                //Request for authorisation of use case
                else if (topic === this.appointmentAuthRequest) {
                    const response = await this.authenticateUserQuery.execute(message.toString())
                    if (response.isSuccess) {
                        this.client.publish(this.appointmentRequest, message.toString())
                        this.client.publish(this.appointmentAuthResponse, JSON.stringify(response))
                    }
                    else {
                        this.client.publish(this.appointmentAuthResponse, JSON.stringify(response))
                    }
                    console.log(response)
                }

                else if (topic === this.userInformationRequest) {
                    const user = await this.getUserInformationQuery.execute(message.toString())
                    this.client.publish(this.userInformationResponse, String(user))
                }
            })
        })
    }
}
