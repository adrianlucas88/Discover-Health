const ReviewDAO = require('../dao/reviewDAO');

const ReviewController = {
  listByResource(req, res, next) {
    try {
      const resourceId = Number(req.params.resourceId);

      if (!Number.isInteger(resourceId) || resourceId <= 0) {
        return res.status(400).json({
          error: 'Invalid resource ID'
        });
      }

      const reviews = ReviewDAO.findByResourceId(resourceId);
      return res.json(reviews);
    } catch (error) {
      return next(error);
    }
  },

  create(req, res, next) {
    try {
      const resourceId = Number(req.params.resourceId);
      const userId = req.session.userId;
      const review = String(req.body.review || '').trim();

      if (!Number.isInteger(resourceId) || resourceId <= 0) {
        return res.status(400).json({
          error: 'Invalid resource ID'
        });
      }

      if (!review) {
        return res.status(400).json({
          error: 'Review text is required'
        });
      }

      if (review.length < 5) {
        return res.status(400).json({
          error: 'Review must be at least 5 characters'
        });
      }

      const newReview = ReviewDAO.create(resourceId, userId, review);
      return res.status(201).json(newReview);
    } catch (error) {
      return next(error);
    }
  }
};

module.exports = ReviewController;