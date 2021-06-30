"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMutations = exports.userQuery = exports.GraphQLUser = exports.userFields = void 0;
const graphql_1 = require("graphql");
const types_1 = require("../types/types");
const resolvers_1 = require("./resolvers");
exports.userFields = {
    _id: { type: graphql_1.GraphQLID },
    name: { type: graphql_1.GraphQLString },
    email: { type: graphql_1.GraphQLString },
    picture: { type: graphql_1.GraphQLString },
    created: { type: types_1.GraphQLDate }
};
exports.GraphQLUser = new graphql_1.GraphQLObjectType({
    name: 'User',
    fields: exports.userFields
});
exports.userQuery = {
    resolve: (_, fields) => fields,
    type: new graphql_1.GraphQLObjectType({
        name: 'UserQuery',
        fields: {
            signIn: {
                type: exports.GraphQLUser,
                args: { code: { type: graphql_1.GraphQLString } },
                resolve: resolvers_1.resolveSignIn
            },
            signOut: {
                type: graphql_1.GraphQLString,
                args: {},
                resolve: resolvers_1.resolveSignOut
            }
        }
    })
};
exports.userMutations = {
    resolve: (_, fields) => fields,
    type: new graphql_1.GraphQLObjectType({
        name: 'UserMutations',
        fields: {
            update: {
                type: exports.GraphQLUser,
                args: {
                    name: { type: graphql_1.GraphQLString }
                },
                resolve: resolvers_1.resolveUpdate
            }
        }
    })
};
//# sourceMappingURL=index.js.map