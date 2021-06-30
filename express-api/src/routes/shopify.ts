
import express from 'express';
var router = express.Router();
import Shopify, { ApiVersion, AuthQuery } from '@shopify/shopify-api';
const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST } = process.env;

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
  const session = await Shopify.Utils.loadCurrentSession(req, res);
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
  console.log('LOGIN BEFORE');
  let authRoute = await Shopify.Auth.beginAuth(req, res, SHOP, '/shopify/auth/callback', true);
  console.log('LOGIN');

  return res.redirect(authRoute);
})

router.get('/auth/callback', async (req, res) => {
  try {
    await Shopify.Auth.validateAuthCallback(req, res, req.query as unknown as AuthQuery); // req.query must be cast to unkown and then AuthQuery in order to be accepted
  } catch (error) {
    console.error(error); // in practice these should be handled more gracefully
  }
  console.log('afterCallback');
  return res.redirect('/shopify'); // wherever you want your user to end up after OAuth completes
});

module.exports = router;
