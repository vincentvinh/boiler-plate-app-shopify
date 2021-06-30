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
exports.resolveSave = exports.resolveUploadImage = exports.resolveGetAll = void 0;
const parseJSON_1 = __importDefault(require("date-fns/parseJSON"));
const nanoid_1 = require("nanoid");
const mime_1 = __importDefault(require("mime"));
const database_1 = require("../database");
let s3 = undefined;
try {
    const AWS = require('aws-sdk');
    AWS.config.update({
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
        region: process.env.AWS_REGION,
        signatureVersion: 'v4'
    });
    s3 = new AWS.S3({
        signatureVersion: 'v4'
    });
}
catch (e) {
    console.log(e);
}
const resolveGetAll = (_, fields, { cookies }) => {
    const email = cookies.get('signed-in-user', { signed: true, secure: true });
    if (!email)
        return [];
    return database_1.findRecipes({ creator: email });
};
exports.resolveGetAll = resolveGetAll;
const resolveUploadImage = (_, fields, { cookies }) => {
    const email = cookies.get('signed-in-user', { signed: true, secure: true });
    if (!email)
        throw 'You are not signed in';
    // Get the extension of the image about to be uploaded
    const ext = fields.fileName.split('.').pop();
    // Find out if the content type is image/jpeg
    const contentType = mime_1.default['getType'](ext);
    // If it is not, throw an error
    if (contentType !== 'image/jpeg')
        throw 'Only JPG images are allowed';
    // Generate a unique file name, inside the folder of the users email on S3
    const key = `${email}/${nanoid_1.nanoid()}.${ext}`;
    // Generate the URL and meta-data required for the client to POST its image directly to S3
    const upload = s3 &&
        s3.createPresignedPost({
            Bucket: process.env.AWS_BUCKET,
            Fields: {
                acl: 'public-read',
                contentType,
                key
            }
        });
    // Send the URL and meta-data for uploading to the client
    // Also send the link the image can be loaded from after uploading
    return {
        link: `https://nfqasiapacific.s3.ap-southeast-1.amazonaws.com/${key}`,
        upload
    };
};
exports.resolveUploadImage = resolveUploadImage;
const resolveSave = (_, fields, { cookies }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = cookies.get('signed-in-user', { signed: true, secure: true });
    if (!email)
        throw 'You are not signed in';
    if (!((_a = fields === null || fields === void 0 ? void 0 : fields.recipe) === null || _a === void 0 ? void 0 : _a.cid))
        throw 'Recipe has no CID';
    const recipe = Object.assign(Object.assign({ id: nanoid_1.nanoid() }, fields === null || fields === void 0 ? void 0 : fields.recipe), { creator: email });
    if (recipe.deleted) {
        yield database_1.deleteRecipe(recipe);
        return Object.assign(Object.assign({}, fields.recipe), { deleted: true });
    }
    if (recipe.created)
        recipe.created = parseJSON_1.default(recipe.created);
    return database_1.setRecipe(recipe);
});
exports.resolveSave = resolveSave;
//# sourceMappingURL=resolvers.js.map