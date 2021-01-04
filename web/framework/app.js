import Vue from 'vue';
import { sync } from 'vuex-router-sync';

export default class App {
  constructor(config) {
    this.config = config;
  }

  bootstrap() {
    if (EASY_ENV_IS_NODE) {
      return this.server();
    }
    return this.client();
  }

  create(initState) {
    const { index, options, createStore, createRouter } = this.config;
    const store = createStore(initState, options);
    const router = createRouter(initState, options);
    sync(store, router);
    return {
      ...index,
      ...options,
      router,
      store
    };
  }

  client() {
    Vue.prototype.$http = require('axios');
    const options = this.create(window.__INITIAL_STATE__);
    const { router, store } = options;
    //后期抽取
    router.beforeEach((route, redirect, next) => {
      next();
    });
    router.afterEach(async (route, redirect) => {
      if (route.matched && route.matched.length) {
        const component = route.matched[0].components.default;
        const asyncData = component.asyncData;
        const metaInfo = component.metaInfo;
        if (asyncData) {
          await asyncData(store, route);
        }
        if (metaInfo) {
          metaInfo(store, store.state.route);
        }
      }
    });
    const app = new Vue(options);
    const root = document.getElementById('app');
    const hydrate = root.childNodes.length > 0;
    app.$mount('#app', hydrate);
    return app;
  }

  server() {
    return context => {
      const options = this.create(context.state);
      const { store, router } = options;
      router.push(context.state.url);
      return new Promise((resolve, reject) => {
        router.onReady(() => {
          const matchedComponents = router.getMatchedComponents();
          if (!matchedComponents) {
            return reject({ code: '404' });
          }
          return Promise.all(
            matchedComponents.map(component => {
              if (component.asyncData) {
                return component.asyncData(store, store.state.route);
              }
              return null;
            })
          ).then(() => {
            for (let component of matchedComponents) {
              if (component.metaInfo) {
                component.metaInfo(store, store.state.route);
              }
            }
            context.state = {
              ...store.state,
              ...context.state
            };
            return resolve(new Vue(options));
          });
        });
      });
    };
  }
}
