const ResourceDAO = require('../dao/resourceDAO');

const ResourceController = {
  listByRegion(req, res) {
    const region = req.query.region;
    const resources = ResourceDAO.findByRegion(region);

    res.json(resources);
  },

  create(req, res) {
    const createdResource = ResourceDAO.create(req.body);

    res.status(201).json(createdResource);
  },

  recommend(req, res) {
    const id = Number(req.params.id);
    const resource = ResourceDAO.findById(id);

    if (!resource) {
      return res.status(404).json({ error: 'Healthcare resource not found' });
    }

    const updatedResource = ResourceDAO.recommend(id);

    res.json(updatedResource);
  }
};

module.exports = ResourceController;