const db = require('../config/database');

const UserDAO = {
  findByUsername(username) {
    return db
      .prepare('SELECT * FROM users WHERE username = ?')
      .get(username);
  },

  findById(id) {
  return db
    .prepare('SELECT id, username, isAdmin FROM users WHERE id = ?')
    .get(id);
},

  create(username, passwordHash) {
  const result = db
    .prepare('INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)')
    .run(username, passwordHash, 0);

  return this.findById(result.lastInsertRowid);
}
};

module.exports = UserDAO;
