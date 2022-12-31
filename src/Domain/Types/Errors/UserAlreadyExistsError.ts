/* eslint-disable prettier/prettier */
export type UserAlreadyExistsError = {
    code: 'user_already_exists_error';
    message: string;
    payload: {
        email: string;
    }
}
