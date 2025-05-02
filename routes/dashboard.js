const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Middleware – ověření přihlášení
function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

// GET /dashboard
router.get('/', checkAuth, async (req, res) => {
  const userId = req.session.user.id;

  // Získání hodnoty pro filtr importantOnly z query parametru
  const importantOnly = req.query.importantOnly === 'true';

  // Načítání poznámek z databáze
  let { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return res.render('dashboard', {
      error: 'Nepodařilo se načíst poznámky.',
      notes: [],
      importantOnly,  // Předání hodnoty importantOnly do šablony
      user: req.session.user
    });
  }

  // Pokud je zapnutý filtr pro důležité poznámky, filtrujeme je
  if (importantOnly) {
    notes = notes.filter(note => note.important);
  }

  // Renderování dashboardu s poznámkami a parametrem importantOnly
  res.render('dashboard', {
    notes,
    error: null,
    importantOnly,  // Předání hodnoty importantOnly do šablony
    user: req.session.user
  });
});

module.exports = router;
