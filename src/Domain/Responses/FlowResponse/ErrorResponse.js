"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
class ErrorResponse {
    constructor(code, detail) {
        this.code = code;
        this.detail = detail;
    }
}
exports.ErrorResponse = ErrorResponse;
