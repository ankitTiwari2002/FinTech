const express = require('express');
const { getSummary } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect);

router.route('/summary')
    .get(authorize('viewer', 'analyst', 'admin'), getSummary);

module.exports = router;
