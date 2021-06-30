import { RequestListener } from 'http';
import express from 'express';
var shopify = require('./routes/shopify');
var index = require('./routes/index');
const app = express();
import graphql from './graphql';

// Handle all HTTP requests for both client and API
export const httpHandler: RequestListener = async (request, response) => {
  // If the request is not made to one of the two endpoints, handle it like a static request for a client file
  // All API responses are always CORS-enabled with JSON content type
  response.setHeader('Content-Type', 'application/json');

  if (request.headers.origin) {
    response.setHeader('Access-Control-Allow-Credentials', 'true');

    response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  }

  // Pre-flight requests do not need to be processed any further, they only need the CORS headers
  if (request.method === 'OPTIONS') {

    response.writeHead(200);

    return response.end();
  }

  // Load any data sent in the request body
  let chunks = '';

  request.on('data', (chunk: Buffer | string) => {
    chunks += chunk;
  });

  request.on('end', () => {
    // If there was a request body, parse the combined raw data chunks
    let body: any = null;

    try {
      body = chunks.length ? JSON.parse(chunks) : null;
    } catch (e) {
      console.log('JSON parse error of request body', chunks);
    }

    // Web client requests
    if (request.url === '/graphql') return graphql(request, response, body);
    

    response.writeHead(404);

    response.end();
  });
};
