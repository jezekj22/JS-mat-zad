require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'tajnyKlic',
  resave: false,
  saveUninitialized: false
}));

// ROUTES
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const dashboardRouter = require('./routes/dashboard');
app.get('/', (req, res) => {
  res.render('index');
});
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/dashboard', dashboardRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server běží na http://localhost:${PORT}`));
