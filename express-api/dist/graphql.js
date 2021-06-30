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
const graphql_1 = require("graphql");
const cookies_1 = __importDefault(require("cookies"));
require('dotenv').config();
const recipe_1 = require("./recipe");
const user_1 = require("./user");
// Secret string that allows the API to securely sign cookies
// Signing a cookie forbids users from manually tampering with it
const keys = process.env.COOKIE_SIGN_KEYS.split(',');
const schema = new graphql_1.GraphQLSchema({
    query: new graphql_1.GraphQLObjectType({
        name: 'Query',
        fields: {
            user: user_1.userQuery,
            recipe: recipe_1.recipeQuery
        }
    }),
    mutation: new graphql_1.GraphQLObjectType({
        name: 'Mutation',
        fields: {
            user: user_1.userMutations,
            recipe: recipe_1.recipeMutations
        }
    })
});
exports.default = (request, response, body) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = new cookies_1.default(request, response, { keys });
    const result = yield graphql_1.graphql(schema, (body === null || body === void 0 ? void 0 : body.query) || '', undefined, { cookies }, (body === null || body === void 0 ? void 0 : body.variables) || {});
    response.writeHead(200);
    response.end(JSON.stringify(result));
});
//# sourceMappingURL=graphql.js.map