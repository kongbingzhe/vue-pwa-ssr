'use strict';
const path = require('path');
const fs = require('fs');
module.exports = app => {
  const exports = {};

  // exports.siteFile = {
  //   '/favicon.ico': fs.readFileSync(path.join(app.baseDir, 'app/web/asset/images/favicon.ico'))
  // };

  exports.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks'
    }
  };
  exports.vuessr = {
    layout: path.join(app.baseDir, 'app/view/layout.html'),
    renderOptions: {
      basedir: path.join(app.baseDir, 'app/view')
    },
    afterRender: (html, ctx) => {
      return html.replace(
        '<div id="injectSw"></div>',
        '<script type="text/javascript" src="public/pwa/registerSw.js"></script>'
      );
    }
  };

  // exports.logger = {
  //   consoleLevel: 'DEBUG',
  //   dir: path.join(app.baseDir, 'logs')
  // };

  exports.static = {
    prefix: '/public/',
    dir: path.join(app.baseDir, 'public')
  };

  exports.keys = '123456';

  // exports.middleware = ['locals', 'access'];

  // exports.security = {
  //   csrf: {
  //     ignoreJSON: false,
  //     cookieName: 'csrfToken',
  //     sessionName: 'csrfToken',
  //     headerName: 'x-csrf-token'
  //   },
  //   xframe: {
  //     enable: false
  //   }
  // };

  return exports;
};
