const express = require('express');
const { registerUser, authUser, getAllUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(registerUser).get(protect, getAllUser);
router.post('/login', authUser);

module.exports = router;