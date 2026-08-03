const express = require('express');
const path = require('path');
const resourceRoutes = require('./routes/resourceRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/resources', resourceRoutes);

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