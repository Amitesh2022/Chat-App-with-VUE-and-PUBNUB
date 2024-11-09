const Room = require('../models/Room');
const Message = require('../models/Message');
const User = require('../models/User');

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const room = new Room({ name });
    await room.save();
    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    res.status(500).json({ error: 'Error creating room' });
  }
};

// Add a user to a room
exports.joinRoom = async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const room = await Room.findById(roomId);
    const user = await User.findById(userId);

    if (!room || !user) {
      return res.status(404).json({ message: 'Room or user not found' });
    }

    // Add the user to the room's members if not already a member
    if (!room.members.includes(user._id)) {
      room.members.push(user._id);
      await room.save();
    }

    res.status(200).json({ message: 'User added to room', room });
  } catch (error) {
    res.status(500).json({ error: 'Error adding user to room' });
  }
};

// Fetch all messages for a room
exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ to: roomId }).populate('from', 'username');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching room messages' });
  }
};

// Send a message to a room
exports.sendMessageToRoom = async (req, res) => {
  try {
    const { roomId, userId, content } = req.body;
    const message = new Message({ from: userId, to: roomId, content });
    await message.save();

    // Broadcast message to room using PubNub, WebSocket, or other method if needed
    res.status(200).json({ message: 'Message sent to room', data: message });
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
};
