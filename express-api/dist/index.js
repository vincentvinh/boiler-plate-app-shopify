"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
var shopify = require('./routes/shopify');
var index = require('./routes/index');
const app = express_1.default();
const root_1 = require("./root");
const http_1 = __importDefault(require("http"));
let server = null;
app.use('/', index);
// app.use('/users', users);
app.use('/shopify', shopify);
server = http_1.default.createServer(root_1.httpHandler).listen(process.env.PORT);
//# sourceMappingURL=index.js.map