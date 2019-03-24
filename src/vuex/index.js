import Vue from 'vue';
import Vuex from 'vuex';
// 用户
import user from './user';

Vue.use(Vuex);
const state = {
  item: []
}

const store = new Vuex.Store({
  state,
  modules: {
    user
  }
});

export default store;
