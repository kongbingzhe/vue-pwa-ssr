'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.get('/api/article/list', app.controller.index.list);
  router.get('/api/article/:id', app.controller.index.detail);
  router.get('(/.*)?', controller.index.index);
};
