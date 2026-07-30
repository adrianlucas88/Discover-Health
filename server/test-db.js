const db = require('./config/database');

const resources = db
  .prepare('SELECT id, name, category, region, recommendations FROM healthcare_resources LIMIT 5')
  .all();

console.log(resources);