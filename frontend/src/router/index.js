import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import ChatRoom from '../components/ChatRoom.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/chat/:roomId', name: 'ChatRoom', component: ChatRoom, props: true }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
