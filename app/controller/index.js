'use strict';
const Controller = require('egg').Controller;
class AppController extends Controller {
  async index(ctx) {
    const { mode } = ctx.query;
    if (mode === 'csr') {
      await this.ctx.renderClient('app.js', {
        url: this.ctx.url
      });
    } else {
      await this.ctx.render('app.js', {
        url: this.ctx.url,
        title: 'GetU'
      });
    }
  }

  async list() {
    this.ctx.body = this.ctx.service.article.getArtilceList(this.ctx.query);
  }

  async detail() {
    const id = Number(this.ctx.params.id);
    this.ctx.body = this.ctx.service.article.getArticle(id);
  }
}

module.exports = AppController;
