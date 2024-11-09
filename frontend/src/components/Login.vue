<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import router from '../router';

export default {
  name: 'UserLogin',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.username, password: this.password })
        });
        const data = await response.json();

        if (data.jwtToken && data.pubnubToken && data.channelName) {
          // Store tokens and channel name
          localStorage.setItem('jwtToken', data.jwtToken);
          localStorage.setItem('pubnubToken', data.pubnubToken);
          localStorage.setItem('channelName', data.channelName);

          // Redirect to chat room with dynamic room ID
          router.push({ name: 'ChatRoom', params: { roomId: data.channelName } });
        } else {
          this.error = data.message || 'Login failed.';
        }
      } catch (error) {
        this.error = 'Login failed. Please try again.';
        console.error("Login error:", error);
      }
    }
  }
};
</script>

<style scoped>
.login {
  max-width: 300px;
  margin: auto;
}
.error {
  color: red;
}
</style>
