<template>
  <div class="online-users">
    <h3>Online Users</h3>
    <ul>
      <li v-for="user in onlineUsers" :key="user._id">{{ user.username }} is online</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      onlineUsers: []
    };
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:5001/api/auth/online-users');
      this.onlineUsers = response.data;
    } catch (error) {
      console.error('Error fetching online users:', error);
    }
  }
};
</script>

<style scoped>
.online-users {
  margin-top: 1em;
}
</style>
