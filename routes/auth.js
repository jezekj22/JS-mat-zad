const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const db = new Database('data.db');


// GET /auth/register
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// POST /auth/register
router.post('/register', (req, res) => {
    const { username, password, ai_agreement } = req.body;
  
    if (!ai_agreement) {
      return res.render('register', { error: 'Musíš souhlasit s využitím dat pro AI.' });
    }
  
    const userExists = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (userExists) {
      return res.render('register', { error: 'Toto uživatelské jméno už existuje.' });
    }
  
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.prepare('INSERT INTO users (username, password_hash, ai_agreement) VALUES (?, ?, ?)').run(
      username,
      hashedPassword,
      1
    );
  
    res.redirect('/auth/login');
});


// GET /auth/login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST /auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user) {
    return res.render('login', { error: 'Uživatel neexistuje.' });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password_hash);
  if (!passwordMatch) {
    return res.render('login', { error: 'Špatné heslo.' });
  }

  // přihlášení
  req.session.user = {
    id: user.id,
    username: user.username
  };

  res.redirect('/'); // nebo kamkoliv, kam chceš po přihlášení
});

  



module.exports = router;
