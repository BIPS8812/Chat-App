const express = require("express");
const { accessChat, fetchChats, createGroupChat, renameGroup, addUser, removeUser } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/group/rename').put(protect, renameGroup);
router.route('/group/addUser').put(protect, addUser);
router.route('/group/removeUser').put(protect, removeUser);

module.exports = router;
