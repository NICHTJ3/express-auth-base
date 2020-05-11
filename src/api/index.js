const express = require('express');
const auth = require('./auth');
const example = require('./example');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏'
  });
});

router.use('/auth', auth);
router.use('/example', example);

module.exports = router;
