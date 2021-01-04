<template>
  <html v-if="isNode">
    <head>
      <title>{{ title }}</title>
      <meta charset="utf-8">
      <meta 
        http-equiv="X-UA-Compatible" 
        content="IE=edge"
      >
      <meta 
        :content="keywords" 
        name="keywords"
      >
      <meta 
        :content="description" 
        name="description"
      >
      <meta 
        http-equiv="content-type" 
        content="text/html;charset=utf-8"
      >
      <meta
        name="viewport"
        content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"
      >
      <meta
        name="msapplication-TileImage"
        content="images/icons/icon-144x144.png"
      >
      <meta 
        name="msapplication-TileColor" 
        content="#2F3BA2"
      >
      <meta 
        name="apple-mobile-web-app-capable" 
        content="yes"
      >
      <meta 
        name="apple-mobile-web-app-status-bar-style" 
        content="black"
      >
      <meta 
        name="apple-mobile-web-app-title" 
        content="Weather PWA"
      >
      <link 
        rel="apple-touch-icon" 
        href="image/logo.png"
      >
      <link 
        rel="shortcut icon" 
        href="/favicon.ico" 
        type="image/x-icon"
      >
      <link 
        rel="apple-touch-icon" 
        href="/loading.png"
      >
    </head>
    <body>
      <div id="app">
        <transition 
          name="fade" 
          mode="out-in"
        >
          <div>
            <layout-header />
            <layout-content>
              <div slot="content">
                <slot />
              </div>
            </layout-content>
          </div>
        </transition>
      </div>
      <div id="injectSw" />
    </body>
  </html>
  <div 
    v-else-if="!isNode" 
    id="app"
  >
    <transition 
      name="fade" 
      mode="out-in"
    >
      <div>
        <layout-header />
        <layout-content>
          <div slot="content">
            <slot />
          </div>
        </layout-content>
      </div>
    </transition>
  </div>
</template>
<script type="text/babel">
import 'asset/css/bootstrap.css';
import 'asset/css/blog.css';
import LayoutHeader from 'components/header/header/';
import LayoutContent from 'components/content/content';
export default {
  components: {
    LayoutHeader,
    LayoutContent
  },
  computed: {
    isNode() {
      return EASY_ENV_IS_NODE;
    },
    title() {
      return this.$store.state.route.meta.title || '';
    },
    keywords() {
      return this.$store.state.route.meta.keywords || '';
    },
    description() {
      return this.$store.state.route.meta.description || '';
    }
  }
};
</script>
