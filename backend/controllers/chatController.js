const PubNub = require('pubnub');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

const pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
  secretKey: process.env.PUBNUB_SECRET_KEY,
  uuid: 'server-uuid'
});

function getUserIdFromToken(req) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new Error("Token is required");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
}

async function generatePubNubToken(userId, channelName) {
  console.log("Generating token with user ID:", userId, "for channel:", channelName);
  console.log("Publish Key:", process.env.PUBNUB_PUBLISH_KEY);
  console.log("Subscribe Key:", process.env.PUBNUB_SUBSCRIBE_KEY);
  console.log("Secret Key:", process.env.PUBNUB_SECRET_KEY);
  const token = await pubnub.grantToken({
    ttl: 60,
    authorized_uuid:  userId.toString(),
    resources: {
      channels: {
        [channelName]: {
          read: true,
          write: true,
        }
      }
    }
  });
  return token;
}
exports.generatePubNubToken = generatePubNubToken; // Export for use in authController

exports.sendMessage = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { from, to, content } = req.body;
    const newMessage = new Message({ from, to, content });
    await newMessage.save();

    pubnub.publish({
      channel: to,
      message: { from, content, timestamp: new Date() },
    }, (status, response) => {
      if (status.error) {
        return res.status(500).json({ error: "Message publishing failed" });
      } else {
        res.status(200).json({ message: "Message sent!", response });
      }
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(401).send("Invalid Token");
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { chatroom } = req.params;
    const messages = await Message.find({ to: chatroom });
    res.json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).send("Error retrieving messages");
  }
};

exports.sendTypingIndicator = (req, res) => {
  const { channel, username, isTyping } = req.body;

  try {
    pubnub.publish({
      channel,
      message: { type: 'typing', username, isTyping },
    }, (status) => {
      if (status.error) {
        res.status(500).send("Failed to send typing indicator");
      } else {
        res.status(200).send("Typing indicator sent");
      }
    });
  } catch (error) {
    console.error("Error in sendTypingIndicator:", error);
    res.status(500).send("Error sending typing indicator");
  }
};
