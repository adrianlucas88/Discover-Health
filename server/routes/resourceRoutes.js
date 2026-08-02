const express = require('express');
const ResourceController = require('../controllers/resourceController');
const { validateResource, validateIdParam } = require('../middleware/validation');

const router = express.Router();

router.get('/', ResourceController.listByRegion);
router.post('/', validateResource, ResourceController.create);
router.post('/:id/recommend', validateIdParam, ResourceController.recommend);

module.exports = router;