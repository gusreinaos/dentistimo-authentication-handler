import {User} from '../../Entities/User';
import {ErrorResponse} from './ErrorResponse';
import {Response} from './Response';

export class ProcessResponse {
  static Success(data: User): Response {
    const response = new Response();
    response.data = data;
    response.isSuccess = true;
    return response;
  }

  static Error(errors: ErrorResponse[] | ErrorResponse): Response {
    const response = new Response();
    response.isSuccess = false;
    if (errors instanceof ErrorResponse) {
      const errorsList: ErrorResponse[] = [];
      errorsList.push(errors);
      response.errors = errorsList;
    } else {
      response.errors = errors;
    }
    return response;
  }
}
