const express = require('express');
const { 
    getRecords, 
    getRecord, 
    createRecord, 
    updateRecord, 
    deleteRecord 
} = require('../controllers/recordController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');

const router = express.Router();

// Require auth for all routes
router.use(protect);

router.route('/')
    .get(authorize('analyst', 'admin'), getRecords)
    .post(
        authorize('admin'),
        [
            body('amount', 'Amount is required and must be a number').isNumeric(),
            body('type', 'Type must be either income or expense').isIn(['income', 'expense']),
            body('category', 'Category is required').not().isEmpty(),
            validate
        ],
        createRecord
    );

router.route('/:id')
    .get(authorize('analyst', 'admin'), getRecord)
    .put(authorize('admin'), updateRecord)
    .delete(authorize('admin'), deleteRecord);

module.exports = router;
