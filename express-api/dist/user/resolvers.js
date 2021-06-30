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
exports.resolveUpdate = exports.resolveSignOut = exports.resolveSignIn = void 0;
const querystring_1 = __importDefault(require("querystring"));
const node_fetch_1 = __importDefault(require("node-fetch"));
require('dotenv').config();
const database_1 = require("../database");
const resolveSignIn = (_, fields, { cookies }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fields.code) {
        const email = cookies.get('signed-in-user', { signed: true, secure: true });
        if (!email)
            throw 'You are not signed in';
        return database_1.getUser(email);
    }
    // Client has just signed into Google and was redirected with a code
    // Use the code to request an access and ID token
    const tokenRequest = yield node_fetch_1.default(`https://oauth2.googleapis.com/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: querystring_1.default.stringify({
            code: fields.code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.CLIENT_URL}/signin`,
            grant_type: 'authorization_code'
        })
    }).catch((error) => console.log(error));
    // If the request was not successful
    if (!tokenRequest)
        throw 'Token request failed';
    const tokens = yield tokenRequest.json();
    // Get the user information with the access and id tokens
    const googleRequest = yield node_fetch_1.default(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`, {
        headers: {
            Authorization: `Bearer ${tokens.id_token}`
        }
    });
    // If the request was not successful
    if (googleRequest.status >= 300) {
        console.log('Google user info error', googleRequest.status, yield googleRequest.text());
        throw 'Google user info error';
    }
    const user = yield googleRequest.json();
    // Save the users email address as a cookie
    // In order to find the user info without a redirect to Google next time
    cookies.set('signed-in-user', user.email, {
        signed: true,
        expires: new Date(2050, 1, 1)
    });
    return database_1.setUser(Object.assign({ created: new Date(), groups: [], password: null }, user));
});
exports.resolveSignIn = resolveSignIn;
const resolveSignOut = (_, fields, { cookies }) => {
    cookies.set('signed-in-user', undefined, { signed: true });
    return 'OK';
};
exports.resolveSignOut = resolveSignOut;
const resolveUpdate = (_, fields, { cookies }) => __awaiter(void 0, void 0, void 0, function* () {
    fields.email = cookies.get('signed-in-user', { signed: true, secure: true });
    if (!fields.email)
        throw 'You are not signed in';
    const user = yield database_1.getUser(fields.email.toLowerCase());
    if (!user)
        throw 'Your user account was not found';
    return database_1.setUser(Object.assign(Object.assign({}, user), { name: fields.name }));
});
exports.resolveUpdate = resolveUpdate;
//# sourceMappingURL=resolvers.js.map