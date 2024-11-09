<template>
  <div class="chat-room">
    <h2>{{ roomName }} Chat Room</h2>
    <p v-if="typingUser && typingUser !== username">{{ typingUser }} is typing...</p>
    <div class="messages">
      <div v-for="message in messages" :key="message._id">
        <strong>{{ message.username }}:</strong> {{ message.content }}
      </div>
    </div>
    <input
      v-model="messageContent"
      @input="sendTypingIndicator"
      @keyup.enter="sendMessage"
      placeholder="Type a message..."
    />
  </div>
</template>

<script>
import PubNub from 'pubnub';
import axios from 'axios';

export default {
  name: 'ChatRoom',
  props: ['roomId', 'roomName'],
  data() {
    return {
      pubnub: null,
      channel: this.roomId,
      username: 'User1', // Replace with actual username from authentication
      messageContent: '',
      messages: [],
      typingUser: '',
      typingTimeout: null
    };
  },
  async mounted() {
    this.pubnub = new PubNub({
      publishKey: 'your-publish-key',
      subscribeKey: 'your-subscribe-key',
      uuid: this.username,
    });

    this.pubnub.setToken(localStorage.getItem('pubnubToken'));
    this.channel = localStorage.getItem('channelName'); // Retrieve dynamic channel name

    this.pubnub.subscribe({ channels: [this.channel] });
    this.pubnub.addListener({
      message: (event) => {
        if (event.message.type === 'typing') {
          this.handleTypingIndicator(event.message);
        } else {
          this.messages.push(event.message);
        }
      }
    });

    await this.fetchRoomMessages();
  },
  methods: {
    async fetchRoomMessages() {
      try {
        const response = await axios.get(`http://localhost:5001/api/rooms/${this.roomId}/messages`);
        this.messages = response.data;
      } catch (error) {
        console.error("Error fetching room messages:", error);
      }
    },
    async sendMessage() {
      if (this.messageContent.trim()) {
        try {
          await axios.post(
            'http://localhost:5001/api/rooms/send',
            {
              roomId: this.roomId,
              userId: this.username,
              content: this.messageContent
            },
            { headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` } }
          );

          this.pubnub.publish({
            channel: this.channel,
            message: { username: this.username, content: this.messageContent }
          });

          this.messageContent = '';
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    },
    sendTypingIndicator() {
      this.pubnub.publish({
        channel: this.channel,
        message: { type: 'typing', username: this.username, isTyping: true }
      });

      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        this.pubnub.publish({
          channel: this.channel,
          message: { type: 'typing', username: this.username, isTyping: false }
        });
      }, 3000);
    },
    handleTypingIndicator({ username, isTyping }) {
      this.typingUser = isTyping ? username : '';
    }
  },
  beforeUnmount() {
    this.pubnub.unsubscribeAll();
  }
};
</script>

<style scoped>
.chat-room {
  max-width: 500px;
  margin: auto;
}
.messages {
  border: 1px solid #ddd;
  padding: 10px;
  height: 300px;
  overflow-y: auto;
}
input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
}
</style>
