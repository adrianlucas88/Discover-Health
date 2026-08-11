const express = require('express');
const path = require('path');
const session = require('express-session');
const resourceRoutes = require('./routes/resourceRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;
const reviewRoutes = require('./routes/reviewRoutes');
app.use(express.json());

app.use(session({
  secret: 'discoverhealth-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use('/api/resources', resourceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', reviewRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`DiscoverHealth server running at http://localhost:${PORT}`);
});