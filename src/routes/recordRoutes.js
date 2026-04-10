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

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Financial records management
 */

// Require auth for all routes
router.use(protect);

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: List all financial records
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of records retrieved
 */
router.route('/')
    .get(authorize('analyst', 'admin'), getRecords)
    /**
     * @swagger
     * /api/records:
     *   post:
     *     summary: Create a new financial record
     *     tags: [Records]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - amount
     *               - type
     *               - category
     *             properties:
     *               amount:
+     *                 type: number
     *               type:
     *                 type: string
     *                 enum: [income, expense]
     *               category:
     *                 type: string
     *               notes:
     *                 type: string
     *     responses:
     *       201:
     *         description: Record created
     */
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

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get a single record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record details
 *   put:
 *     summary: Update a record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated
 *   delete:
 *     summary: Soft delete a record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted
 */
router.route('/:id')
    .get(authorize('analyst', 'admin'), getRecord)
    .put(authorize('admin'), updateRecord)
    .delete(authorize('admin'), deleteRecord);

module.exports = router;
