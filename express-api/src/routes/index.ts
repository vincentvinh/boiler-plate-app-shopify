import express from 'express';
var router = express.Router();

router.get('/', function (req, res) {
  return res.status(200).json('HELLO');
});

module.exports = router;
