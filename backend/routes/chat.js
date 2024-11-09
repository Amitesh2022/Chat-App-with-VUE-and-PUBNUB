const express = require('express');
const { sendMessage, getMessages } = require('../controllers/chatController');
const router = express.Router();

router.post('/send', sendMessage);
router.get('/:chatroom', getMessages);
const { sendTypingIndicator } = require('../controllers/chatController');

router.post('/typing', sendTypingIndicator);

module.exports = router;

module.exports = router;
