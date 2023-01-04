import {ErrorResponse} from './ErrorResponse';

export class Response {
  data: any;
  isSuccess = false;
  errors: ErrorResponse[] = [];

  constructor() {}
}
