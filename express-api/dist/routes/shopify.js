"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const shopify_api_1 = __importStar(require("@shopify/shopify-api"));
const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST } = process.env;
shopify_api_1.default.Context.initialize({
    API_KEY,
    API_SECRET_KEY,
    SCOPES: [SCOPES],
    HOST_NAME: HOST,
    IS_EMBEDDED_APP: false,
    API_VERSION: shopify_api_1.ApiVersion.January21,
    SESSION_STORAGE: new shopify_api_1.default.Session.MemorySessionStorage()
});
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield shopify_api_1.default.Utils.loadCurrentSession(req, res);
    // GraphQLClient takes in the shop url and the accessToken for that shop.
    const client = new shopify_api_1.default.Clients.Graphql(session.shop, session.accessToken);
    // Use client.query and pass your query as `data`
    const products = yield client.query({
        data: `{
        products (first: 10) {
          edges {
            node {
              id
              title
              descriptionHtml
            }
          }
        }
      }`,
    });
    return res.status(200).json(products);
}));
// the rest of the example code goes here
router.get('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let authRoute = yield shopify_api_1.default.Auth.beginAuth(req, res, SHOP, '/shopify/auth/callback', true);
    return res.redirect(authRoute);
}));
router.get('/auth/callback', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield shopify_api_1.default.Auth.validateAuthCallback(req, res, req.query); // req.query must be cast to unkown and then AuthQuery in order to be accepted
    }
    catch (error) {
        console.error(error); // in practice these should be handled more gracefully
    }
    console.log('afterCallback');
    return res.redirect('/shopify'); // wherever you want your user to end up after OAuth completes
}));
module.exports = router;
//# sourceMappingURL=shopify.js.map