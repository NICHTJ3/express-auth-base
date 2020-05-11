const express = require('express');
const { ensureLoggedIn } = require('../middlewares');

const router = express.Router();

router.get('/', ensureLoggedIn, (req, res) => {
  res.json({ message: 'Welcome to the example endpoint' });
});

module.exports = router;
