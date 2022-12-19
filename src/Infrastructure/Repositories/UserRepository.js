"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const UserSchema_1 = __importDefault(require("../Models/UserSchema"));
class UserRepository {
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSchema_1.default.findOne({ _id: id });
        });
    }
    getUserByAccessToken(jwt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSchema_1.default.findOne({ jwt: jwt });
        });
    }
    getUserByEmailAndPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSchema_1.default.findOne({ email: email, password: password });
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSchema_1.default.create(user);
        });
    }
    updateUserById(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSchema_1.default.findOneAndUpdate({ _id: id }, user);
        });
    }
    updateUserByEmail(email, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSchema_1.default.findOneAndUpdate({ email: email }, user);
        });
    }
}
exports.UserRepository = UserRepository;
