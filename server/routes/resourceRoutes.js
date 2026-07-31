const express = require('express');
const ResourceController = require('../controllers/resourceController');

const router = express.Router();

router.get('/', ResourceController.listByRegion);
router.post('/', ResourceController.create);
router.post('/:id/recommend', ResourceController.recommend);

module.exports = router;