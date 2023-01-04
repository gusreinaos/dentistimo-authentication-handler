"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessResponse = void 0;
const ErrorResponse_1 = require("./ErrorResponse");
const Response_1 = require("./Response");
class ProcessResponse {
    static Success(data) {
        const response = new Response_1.Response();
        response.data = data;
        response.isSuccess = true;
        return response;
    }
    static Error(errors) {
        const response = new Response_1.Response();
        response.isSuccess = false;
        if (errors instanceof ErrorResponse_1.ErrorResponse) {
            const errorsList = [];
            errorsList.push(errors);
            response.errors = errorsList;
        }
        else {
            response.errors = errors;
        }
        return response;
    }
}
exports.ProcessResponse = ProcessResponse;
