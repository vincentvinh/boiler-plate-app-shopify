import express from 'express';
require('dotenv').config();
var shopify = require('./routes/shopify');
var index = require('./routes/index');
const app = express();
import { httpHandler } from './root';
import http, { Server } from 'http';

let server: Server | null = null;

app.use('/', index);
// app.use('/users', users);
app.use('/shopify', shopify);

server = http.createServer(httpHandler).listen(process.env.PORT);
