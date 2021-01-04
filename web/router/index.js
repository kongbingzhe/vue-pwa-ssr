import Vue from 'vue';

import VueRouter from 'vue-router';

import Home from 'page/home';

Vue.use(VueRouter);

export default function createRouter(initState, options) {
  const { base } = options;
  return new VueRouter({
    mode: 'history',
    base,
    routes: [
      {
        path: '/',
        component: Home,
        meta: {}
      }
    ]
  });
}
