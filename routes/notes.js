const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Middleware pro přihlášení
function checkAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

// GET /notes/new - formulář
router.get('/new', checkAuth, (req, res) => {
  res.render('notes/new');
});

// POST /notes/new - uložení poznámky
router.post('/new', checkAuth, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.user.id;

  const { error } = await supabase
    .from('notes')
    .insert([
      {
        title,
        content,
        user_id: userId,
        important: false, // výchozí hodnota
        // created_at se automaticky nastaví
      }
    ]);

  if (error) {
    console.error('Chyba při vkládání poznámky:', error.message);
    return res.render('notes/new', { error: 'Nepodařilo se uložit poznámku.' });
  }

  res.redirect('/dashboard');
});

// POST /notes/delete/:id – smazání poznámky
router.post('/delete/:id', checkAuth, async (req, res) => {
  const noteId = req.params.id;
  const userId = req.session.user.id;

  const { error } = await supabase
    .from('notes')
    .delete()
    .match({ id: noteId, user_id: userId }); // ochrana: smaže jen vlastní poznámku

  if (error) {
    console.error('Chyba při mazání poznámky:', error.message);
  }

  res.redirect('/dashboard');
});

// Přepnutí stavu 'important' pro danou poznámku
router.post('/toggle-important/:id', checkAuth, async (req, res) => {
  const noteId = req.params.id;
  const userId = req.session.user.id;

  // Nejprve zjistíme současnou hodnotu
  const { data: note, error: fetchError } = await supabase
    .from('notes')
    .select('important')
    .eq('id', noteId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !note) {
    console.error(fetchError || 'Poznámka nenalezena');
    return res.redirect('/dashboard');
  }

  // Přepneme boolean
  const { error: updateError } = await supabase
    .from('notes')
    .update({ important: !note.important })
    .eq('id', noteId)
    .eq('user_id', userId);

  if (updateError) {
    console.error(updateError);
  }

  res.redirect('/dashboard');
});

module.exports = router;
