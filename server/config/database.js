const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'database', 'DB.db');

const db = new Database(dbPath);

module.exports = db;