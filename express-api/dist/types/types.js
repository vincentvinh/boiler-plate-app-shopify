"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLAny = exports.GraphQLDate = void 0;
const graphql_1 = require("graphql");
const language_1 = require("graphql/language");
const date_fns_1 = require("date-fns");
exports.GraphQLDate = new graphql_1.GraphQLScalarType({
    name: 'Date',
    serialize: (value) => new Date(value),
    parseValue: (value) => date_fns_1.parseJSON(value),
    parseLiteral: (ast) => {
        if (ast.kind !== language_1.Kind.STRING)
            return null;
        return date_fns_1.parseJSON(`${ast}`);
    }
});
exports.GraphQLAny = new graphql_1.GraphQLScalarType({
    name: 'Any',
    serialize: (value) => value,
    parseValue: (value) => value,
    parseLiteral: (ast) => ast
});
//# sourceMappingURL=types.js.map