/* eslint-disable prettier/prettier */
export type UserNotFoundError = {
    code: 'user_not_found_error';
    message: string;
    payload: {
        email: string;
    }
}
