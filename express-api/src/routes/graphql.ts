import express from 'express';
var router = express.Router();
import graphql from '../graphql';

router.get('/graphql', async (req, res) => {
  // Load any data sent in the request body
  let chunks = '';

  req.on('data', (chunk: Buffer | string) => {
    chunks += chunk;
  });
  let body: any = null;

  try {
    body = chunks.length ? JSON.parse(chunks) : null;
  } catch (e) {
    console.log('JSON parse error of request body', chunks);
  }
  const response = graphql(req, res, body);
  return res.status(200).json(response);
})

module.exports = router;
