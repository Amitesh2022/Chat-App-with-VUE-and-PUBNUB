<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserRegister',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
async register() {
  try {
    // Clear previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Send registration request to backend
    const response = await axios.post('http://localhost:5001/api/auth/register', {
      username: this.username,
      password: this.password
    });

    // Store tokens and channel name
    const { jwtToken, pubnubToken, channelName } = response.data;
    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('pubnubToken', pubnubToken);
    localStorage.setItem('channelName', channelName);

    // Redirect to chat room
    this.successMessage = 'Registration successful! Redirecting to chat...';
    setTimeout(() => this.$router.push({ name: 'ChatRoom', params: { roomId: channelName } }), 2000);

  } catch (error) {
    this.errorMessage = error.response?.data?.error || 'Registration failed. Try a different username.';
  }
}

  }
};
</script>

<style scoped>
.register {
  max-width: 300px;
  margin: auto;
}
.error {
  color: red;
}
.success {
  color: green;
}
</style>
