import http from 'http';
import url from 'url';
import querystring from 'querystring';
import Shopify, { ApiVersion, AuthQuery } from '@shopify/shopify-api';
require('dotenv').config();

const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST } = process.env

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: ['read_products'],
  HOST_NAME: HOST,
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.January21, // all supported versions are available, as well as "unstable" and "unversioned"
});

async function onRequest(request: http.IncomingMessage, response: http.ServerResponse): Promise<void> {
  const { headers, url: req_url } = request;
  const pathName: string | null = url.parse(req_url).pathname;
  const queryString: string = (String)(url.parse(req_url).query);
  const query: Record<string, any> = querystring.parse(queryString);

  if (pathName === '/') {
    // check if we're logged in/authorized
    const currentSession = await Shopify.Utils.loadCurrentSession(request, response);

    console.log(currentSession);
    if(!currentSession) {
      // not logged in, redirect to login
      console.log('not authorized');
      response.writeHead(302, { 'Location': `/login` });
      response.end();
    } else {
      console.log('authorized');
      // do something amazing with your application!
    }
    return;
  } // end of if(pathName === '/')

  if (pathName === '/login') {
    // process login action
    try {
      const authRoute = await Shopify.Auth.beginAuth(request, response, SHOP, '/auth/callback');
      console.log(authRoute);
      response.writeHead(302, { 'Location': authRoute });
      response.end();
    }
    catch (e) {
      console.log(e);

      response.writeHead(500);
      if (e instanceof Shopify.Errors.ShopifyError) {
        response.end(e.message);
      }
      else {
        response.end(`Failed to complete OAuth process: ${e.message}`);
      }
    }
    return;
  } // end of if (pathName === '/login')

  if (pathName === '/auth/callback') {
    try {
      await Shopify.Auth.validateAuthCallback(request, response, query as AuthQuery);
      console.log('callback');
      // all good, redirect to '/'
      response.writeHead(302, { 'Location': '/' });
      response.end();
    }
    catch (e) {
      console.log(e);

      response.writeHead(500);
      if (e instanceof Shopify.Errors.ShopifyError) {
        response.end(e.message);
      }
      else {
        response.end(`Failed to complete OAuth process: ${e.message}`);
      }
    }
    return;
  } // end of if (pathName === '/auth/callback'')
}  // end of onRequest()

http.createServer(onRequest).listen(3000);
// import fs from 'fs';
// import path from 'path';
// import https from 'https';
// import dotenv from 'dotenv';
// import http, { Server } from 'http';

// // Load the .env.development or .env.production file into environment variables
// dotenv.config({
//   path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`)
// });

// import { httpHandler } from './root';

// let server: Server | null = null;

// // If HTTPS_PORT is defined in the .env file
// if (process.env.HTTPS_PORT) {
//   // Redirect all traffic from HTTP to HTTPS
//   http
//     .createServer((request, response) => {
//       response.writeHead(302, { Location: `${process.env.CLIENT_URL}${request.url}` });
//       response.end();
//     })
//     .listen(process.env.PORT);

//   // Host the API using SSL certificates from the ../ssl folder, ignored by Git
//   const certPath = '../ssl';

//   server = https
//     .createServer(
//       {
//         key: fs.readFileSync(`${certPath}/privkey.pem`, 'utf8'),
//         cert: fs.readFileSync(`${certPath}/cert.pem`, 'utf8'),
//         ca: fs.readFileSync(`${certPath}/chain.pem`, 'utf8')
//       },
//       httpHandler
//     )
//     .listen(process.env.HTTPS_PORT);

//   console.log(`API: https://${process.env.API_DOMAIN}:${process.env.HTTPS_PORT}`);
// } else {
//   // If no HTTPS_PORT is defined, only host a HTTP server
//   server = http.createServer(httpHandler).listen(process.env.PORT);

//   console.log(`API: http://${process.env.API_DOMAIN}:${process.env.PORT}`);
// }
