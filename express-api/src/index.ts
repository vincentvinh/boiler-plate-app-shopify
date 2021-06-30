import express from 'express';
require('dotenv').config();
var shopify = require('./routes/shopify');
var index = require('./routes/index');
var graphql = require('./routes/graphql');
const app = express();

app.use('/', index);
// app.use('/users', users);
app.use('/shopify', shopify);
app.use('/graphql', graphql)

app.listen(3000, () => {
  console.log('your app is now listening on port 3000');
});
