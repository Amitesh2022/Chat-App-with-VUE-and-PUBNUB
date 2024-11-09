// Import required modules
const PubNub = require('pubnub');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Initialize PubNub for server operations
const pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
  secretKey: process.env.PUBNUB_SECRET_KEY,
  uuid: 'server-uuid'
});

// Function to generate PubNub token
async function generatePubNubToken(userId, channelName) {
  return await pubnub.grantToken({
    ttl: 60,
    authorized_uuid: userId,
    resources: {
      channels: {
        [channelName]: {
          read: true,
          write: true,
        },
      },
    },
  });
}

// Register a new user and generate tokens
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Generate JWT token for authentication
    const jwtToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Generate unique channel name
    const channelName = `chat-${newUser._id}`;

    // Generate PubNub token for the user
    const pubnubToken = await generatePubNubToken(newUser._id, channelName);

    // Respond with JWT, PubNub token, and channel name
    res.status(201).json({ jwtToken, pubnubToken, channelName });

  } catch (error) {
    console.error("Error registering user:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Username already exists" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user and verify password
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for authentication
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Use the unique user channel for messaging
    const channelName = `chat-${user._id}`;

    // Generate PubNub token for the user
    const pubnubToken = await generatePubNubToken(user._id, channelName);

    // Respond with JWT, PubNub token, and channel name
    res.status(200).json({ jwtToken, pubnubToken, channelName });

  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
