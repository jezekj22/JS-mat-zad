const express = require('express');
const router = express.Router();

// Zkušební route
router.get('/login', (req, res) => {
  res.send('Login page zatím není hotová');
});

module.exports = router;
