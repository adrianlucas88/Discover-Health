const db = require('../config/database');

const ReviewDAO = {
  findByResourceId(resourceId) {
    return db
      .prepare(`
        SELECT
          reviews.id,
          reviews.resource_id,
          reviews.review,
          reviews.user_id,
          users.username
        FROM reviews
        LEFT JOIN users ON reviews.user_id = users.id
        WHERE reviews.resource_id = ?
        ORDER BY reviews.id DESC
      `)
      .all(resourceId);
  },

  create(resourceId, userId, review) {
    const result = db
      .prepare(`
        INSERT INTO reviews (resource_id, review, user_id)
        VALUES (?, ?, ?)
      `)
      .run(resourceId, review, userId);

    return db
      .prepare(`
        SELECT
          reviews.id,
          reviews.resource_id,
          reviews.review,
          reviews.user_id,
          users.username
        FROM reviews
        LEFT JOIN users ON reviews.user_id = users.id
        WHERE reviews.id = ?
      `)
      .get(result.lastInsertRowid);
  }
};

module.exports = ReviewDAO;