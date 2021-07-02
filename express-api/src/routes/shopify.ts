
import express from 'express';
var router = express.Router();
import Shopify, { ApiVersion, AuthQuery } from '@shopify/shopify-api';
import { setShopify, findShopify } from '../database';
const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST } = process.env;
var cors = require('cors')
var corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.options('/graphql', cors(corsOptions))

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: [SCOPES],
  HOST_NAME: HOST,
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.January21, // all supported versions are available, as well as "unstable" and "unversioned",
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage()
});

router.get('/', async (req, res) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res, false);
  const shopifyAuth = {
    scope: SCOPES,
    access_token: session.accessToken
  }
  await setShopify(shopifyAuth);

  // GraphQLClient takes in the shop url and the accessToken for that shop.
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  
  // Use client.query and pass your query as `data`
  const products = await client.query({
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
  })
  return res.status(200).json(products);
})

// the rest of the example code goes here
router.get('/login', async (req, res) => {
  let authRoute = await Shopify.Auth.beginAuth(req, res, SHOP, '/shopify/auth/callback', true);

  return res.redirect(authRoute);
})

router.get('/auth/callback', async (req, res) => {
  try {
    await Shopify.Auth.validateAuthCallback(req, res, req.query as unknown as AuthQuery); // req.query must be cast to unkown and then AuthQuery in order to be accepted
  } catch (error) {
    console.error(error); // in practice these should be handled more gracefully
  }
  return res.redirect('/shopify'); // wherever you want your user to end up after OAuth completes
});

router.post('/graphql', cors(corsOptions) , async (req, res) => {

  const shopifyAuth = await findShopify();  
  // GraphQLClient takes in the shop url and the accessToken for that shop.
  const client = new Shopify.Clients.Graphql(SHOP, shopifyAuth?.access_token);
  // Use client.query and pass your query as `data`
  const products = await client.query({
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
  })
  console.log(products);

  res.end(JSON.stringify(products));
})

module.exports = router;
