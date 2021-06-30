import express from 'express';
var router = express.Router();
import graphql from '../graphql';
var cors = require('cors')
var corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.options('/', cors(corsOptions))
router.post('/', cors(corsOptions) , async (req, res) => {
  // Load any data sent in the request body
  let chunks = '';

  req.on('data', (chunk: Buffer | string) => {
    chunks += chunk;
  });

  req.on('end', () => {
    // If there was a request body, parse the combined raw data chunks
    let body: any = null;

    try {
      body = chunks.length ? JSON.parse(chunks) : null;
    } catch (e) {
      console.log('JSON parse error of request body', chunks);
    }

    // Web client requests
    if (req.url === '/') return graphql(req, res, body);

    res.writeHead(404);

    res.end();
  });
})

module.exports = router;
