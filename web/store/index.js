'use strict';
import Vue from 'vue';
import Vuex from 'vuex';

// import actions from './actions';
// import getters from './getters';
// import mutations from './mutations';
import article from './modules/article';

Vue.use(Vuex);

export default function createStore(initState = {}) {
  const state = {
    ...initState
  };

  const modules = {
    article: article(initState)
  };

  return new Vuex.Store({
    state,
    // actions,
    // getters,
    // mutations,
    modules
  });
}
