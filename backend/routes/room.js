const express = require('express');
const {
  createRoom,
  joinRoom,
  getRoomMessages,
  sendMessageToRoom
} = require('../controllers/roomController');
const router = express.Router();

// Route to create a new room
router.post('/create', createRoom);

// Route to add a user to a room
router.post('/join', joinRoom);

// Route to fetch messages in a room
router.get('/:roomId/messages', getRoomMessages);

// Route to send a message to a room
router.post('/send', sendMessageToRoom);

module.exports = router;
