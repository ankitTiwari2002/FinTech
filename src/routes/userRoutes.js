const express = require('express');
const { getUsers, updateUserStatus, updateUserRole } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

// All routes below require user to be logged in and have 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(getUsers);

router.route('/:id/status')
    .patch(updateUserStatus);

router.route('/:id/role')
    .patch(updateUserRole);

module.exports = router;
