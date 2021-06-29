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
app.use('/', index);
// app.use('/users', users);
app.use('/shopify', shopify);
app.listen(3000, () => {
    console.log('your app is now listening on port 3000');
});
//# sourceMappingURL=index.js.map