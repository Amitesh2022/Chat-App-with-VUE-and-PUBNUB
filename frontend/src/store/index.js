import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    token: null,
    chatMessages: [],
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    ADD_MESSAGE(state, message) {
      state.chatMessages.push(message);
    },
  },
  actions: {
    async login({ commit }, credentials) {
      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        credentials
      );
      commit("SET_TOKEN", res.data.token);
    },
    async sendMessage({ commit }, message) {
      const res = await axios.post(
        "http://localhost:5001/api/chat/send",
        message
      );
      commit("ADD_MESSAGE", res.data.message);
    },
  },
});
