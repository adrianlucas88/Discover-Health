const express = require('express');
const ReviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/resources/:resourceId/reviews',
  ReviewController.listByResource
);

router.post(
  '/resources/:resourceId/reviews',
  requireAuth,
  ReviewController.create
);

module.exports = router;