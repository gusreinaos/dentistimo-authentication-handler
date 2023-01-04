export class ErrorResponse {
  readonly code: string;
  readonly detail: string;
  constructor(code: string, detail: string) {
    this.code = code;
    this.detail = detail;
  }
}
