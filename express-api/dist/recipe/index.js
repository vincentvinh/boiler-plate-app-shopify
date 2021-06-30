"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipeMutations = exports.recipeQuery = exports.GraphQLAWSUpload = exports.GraphQLRecipePayload = exports.GraphQLRecipe = exports.recipeFields = void 0;
const graphql_1 = require("graphql");
const types_1 = require("../types/types");
const resolvers_1 = require("./resolvers");
exports.recipeFields = {
    _id: { type: graphql_1.GraphQLID },
    cid: { type: graphql_1.GraphQLID },
    name: { type: graphql_1.GraphQLString },
    duration: { type: graphql_1.GraphQLString },
    creator: { type: graphql_1.GraphQLString },
    difficulty: { type: graphql_1.GraphQLInt },
    image: { type: graphql_1.GraphQLString },
    text: { type: graphql_1.GraphQLString },
    created: { type: types_1.GraphQLDate },
    deleted: { type: graphql_1.GraphQLBoolean }
};
exports.GraphQLRecipe = new graphql_1.GraphQLObjectType({
    name: 'Recipe',
    fields: Object.assign(Object.assign({}, exports.recipeFields), { cid: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLID) } })
});
exports.GraphQLRecipePayload = new graphql_1.GraphQLInputObjectType({
    name: 'RecipePayload',
    fields: exports.recipeFields
});
exports.GraphQLAWSUpload = new graphql_1.GraphQLObjectType({
    name: 'AWSUpload',
    fields: {
        link: { type: graphql_1.GraphQLString },
        upload: { type: types_1.GraphQLAny }
    }
});
exports.recipeQuery = {
    resolve: (_, fields) => fields,
    type: new graphql_1.GraphQLObjectType({
        name: 'RecipeQuery',
        fields: {
            getAll: {
                type: new graphql_1.GraphQLList(exports.GraphQLRecipe),
                args: {},
                resolve: resolvers_1.resolveGetAll
            },
            uploadImage: {
                type: exports.GraphQLAWSUpload,
                args: {
                    fileName: { type: graphql_1.GraphQLNonNull(graphql_1.GraphQLString) }
                },
                resolve: resolvers_1.resolveUploadImage
            }
        }
    })
};
exports.recipeMutations = {
    resolve: (_, fields) => fields,
    type: new graphql_1.GraphQLObjectType({
        name: 'RecipeMutations',
        fields: {
            save: {
                type: exports.GraphQLRecipe,
                args: {
                    recipe: { type: exports.GraphQLRecipePayload }
                },
                resolve: resolvers_1.resolveSave
            }
        }
    })
};
//# sourceMappingURL=index.js.map