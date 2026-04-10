const express = require('express');
const { getSummary } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: High-level financial summaries
 */

router.use(protect);

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get high-level summary of incomes and expenses
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved
 */
router.route('/summary')
    .get(authorize('viewer', 'analyst', 'admin'), getSummary);

module.exports = router;
