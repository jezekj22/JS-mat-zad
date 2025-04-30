const express = require('express');
const router = express.Router();

// Middleware – kontrola přihlášení (zatím placeholder)
function isAuthenticated(req, res, next) {
  // pokud budeš mít session, tady to později ošetříš
  if (req.session && req.session.username) {
    return next();
  }
  res.redirect('/login');
}

// Hlavní stránka s výpisem poznámek
router.get('/', isAuthenticated, (req, res) => {
  // Tady se budou načítat poznámky z DB podle req.session.username
  res.render('notes', { notes: [] }); // Zatím prázdné
});

module.exports = router;
