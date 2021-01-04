# egg-vue-pwa-ssr

基于 Egg + Vue + Webpack 单页面服务端渲染(SSR)同构工程骨架项目


## 文档

- https://github.com/easy-team
- https://www.yuque.com/easy-team/egg-vue


## 目录结构

```
|- app                        服务端代码
|   |
|   |- controller             egg控制器
|   |
|   |- extend                 egg内置扩展
|   |
|   |- middleware             egg自定义中间件
|   |
|   |- service                服务端渲染中台获取后台数据
|   |
|   |-view                    服务端渲染的源文件
|
|- config                     egg配置文件
|
|- build                      webpack构建文件
|   |
|   |- webpack.client.js      客户端激活代码构建配置
|   |
|   |- webpack.server.js      服务端渲染代码构建配置
|
|- public                     服务端渲染后，客户端激活的代码
|
|- web                        客户端代码
    |
    |- asset                  page中使用的css、img、font
    |
    |- components             page中使用的组件           
    |
    |- framework              客户端和服务端公用骨架相关代码
    |
    |- page                   各个路由的页面级组件
    |
    |- router                 vueRouter相关设置
    |
    |- store                  vuex相关设置
    |
    |- static                 客户端用到的favicon.ico等资源
    |
    |- pwa                    pwa相关的文件
    |
    |- utils                  错误处理、请求处理、时间转换、数据转换等工具方法

```


## 1.特性

- 基于 vue + vuex + vue-router + axios 单页面服务器客户端同构实现

- 支持 server 和 client 端代码修改, webpack 时时编译和热更新, `npm start` 一键启动应用

- 支持开发环境, 测试环境，正式环境 webpack 编译
 

## 2.依赖

- [egg-view-vue-ssr](https://github.com/easy-team/egg-view-vue-ssr) ^3.x.x
- [egg-webpack](https://github.com/easy-team/egg-webpack) ^5.x.x
- [egg-webpack-vue](https://github.com/easy-team/egg-webpack-vue) ^2.x.x


## 3. 使用

#### 3.1 安装依赖

```bash
npm install
```


#### 3.2 启动应用

##### 本地开发启动应用

```bash
npm run dev
```

应用访问: http://127.0.0.1:7001

##### 发布模式启动应用

- 首先在本地或者ci构建好jsbundle文件

```bash
npm run build 
```

- 然后,启动应用

```bash
npm start 
```

## 4. 功能实现

#### 4.1 单页面前端实现

在web/page 目录下面创建app目录, app.vue, app.js 文件.

- app.vue 编写界面逻辑, 根元素为layout(自定义组件, 全局注册, 统一的html, meta, header, body)

```html
<template>
  <app-layout>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </app-layout>
</template>
<style lang="sass">

</style>
<script type="text/babel">
  export default {
    computed: {

    },
    mounted(){

    }
  }
</script>
```

- app.js 页面调用入口

```javascript
import { sync } from 'vuex-router-sync';
import store from 'store/app';
import router from 'component/app/router';
import app from './app.vue';
import App from 'app';
import Layout from 'component/layout/app';

App.component(Layout.name, Layout);

sync(store, router);

export default App.init({
  base: '/app',
  ...app,
  router,
  store
});

```

#### 4.2 单页面后端实现

- 创建controller文件app.js

```javascript
exports.index = async (ctx) {
  await ctx.render('app/app.js', { url: this.url.replace(/\/app/, '') });
};
```

- 添加路由配置

```javascript
  app.get('/app(/.+)?', app.controller.app.app.index);
```


## License

[MIT](LICENSE)
