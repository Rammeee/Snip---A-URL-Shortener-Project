// URL management routes (all protected by JWT auth middleware)

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { createUrl, getUrls, deleteUrl, getAnalytics } = require('../controllers/urlController');

const router = express.Router();

// All routes below require a valid JWT
router.use(authMiddleware);

router.post('/', createUrl);
router.get('/', getUrls);
router.delete('/:id', deleteUrl);
router.get('/:id/analytics', getAnalytics);

module.exports = router;
