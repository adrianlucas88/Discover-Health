const db = require('../config/database');

const ResourceDAO = {
  findByRegion(region) {
    if (!region) {
      return db
        .prepare('SELECT * FROM healthcare_resources ORDER BY name')
        .all();
    }

    return db
      .prepare('SELECT * FROM healthcare_resources WHERE region = ? COLLATE NOCASE ORDER BY name')
      .all(region);
  },

  findById(id) {
    return db
      .prepare('SELECT * FROM healthcare_resources WHERE id = ?')
      .get(id);
  },

  create(resource) {
    const statement = db.prepare(`
      INSERT INTO healthcare_resources
      (name, category, country, region, lat, lon, description, recommendations)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `);

    const result = statement.run(
      resource.name,
      resource.category,
      resource.country,
      resource.region,
      resource.lat || null,
      resource.lon || null,
      resource.description || ''
    );

    return this.findById(result.lastInsertRowid);
  },

  recommend(id) {
    db.prepare(`
      UPDATE healthcare_resources
      SET recommendations = recommendations + 1
      WHERE id = ?
   `).run(id);

    return this.findById(id);
  }
};

module.exports = ResourceDAO;