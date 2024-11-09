<template>
  <div id="app">
    <nav>
      <router-link to="/">Login</router-link> |
      <router-link to="/register">Register</router-link> |
      <!-- Dynamic Chat Room link (sample roomId) -->
      <router-link :to="{ name: 'ChatRoom', params: { roomId: '123' } }">Chat Room</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
nav {
  padding: 1em;
}
nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #42b983;
}
nav a.router-link-exact-active {
  font-weight: bold;
  color: #35495e;
}
</style>
