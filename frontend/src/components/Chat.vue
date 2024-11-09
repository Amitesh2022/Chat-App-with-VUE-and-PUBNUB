<template>
  <div>
    <h2>Chatroom</h2>
    <div v-for="msg in messages" :key="msg._id">
      <p>{{ msg.from }}: {{ msg.content }}</p>
    </div>
    <input v-model="message" @keyup.enter="sendMessage" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      messages: [],
    };
  },
  methods: {
    sendMessage() {
      this.$store.dispatch('sendMessage', { from: this.$store.state.user, content: this.message });
      this.message = '';
    },
  },
};
</script>
