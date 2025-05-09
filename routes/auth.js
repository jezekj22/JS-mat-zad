const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const supabase = require('../supabase');

// GET /auth/register
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// POST /auth/register
router.post('/register', async (req, res) => {
  const { username, password, ai_agreement } = req.body;

  if (!ai_agreement) {
    return res.render('register', { error: 'Musíš souhlasit s využitím dat pro AI.' });
  }

  const { data: existingUser, error: findError } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (existingUser) {
    return res.render('register', { error: 'Toto uživatelské jméno už existuje.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const { error: insertError } = await supabase
    .from('users')
    .insert([{ username, password_hash: hashedPassword, ai_agreement: true }]);

  if (insertError) {
    return res.render('register', { error: 'Chyba při vytváření účtu.' });
  }

  res.redirect('/auth/login');
});

// GET /auth/login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const { data: user, error: findError } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (!user) {
    return res.render('login', { error: 'Uživatel neexistuje.' });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password_hash);
  if (!passwordMatch) {
    return res.render('login', { error: 'Špatné heslo.' });
  }

  req.session.user = {
    id: user.id,
    username: user.username
  };

  res.redirect('/dashboard');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

router.post('/delete-account', async (req, res) => {
  const userId = req.session.user.id;

  // Smažeme poznámky
  const { error: deleteNotesError } = await supabase
    .from('notes')
    .delete()
    .eq('user_id', userId);

  if (deleteNotesError) {
    console.error(deleteNotesError);
    return res.redirect('/dashboard');
  }

  // Smažeme samotného uživatele
  const { error: deleteUserError } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (deleteUserError) {
    console.error(deleteUserError);
    return res.redirect('/dashboard');
  }

  // Odhlášení (zrušení session)
  req.session.destroy(() => {
    res.redirect('/auth/register');
  });
});


module.exports = router;
