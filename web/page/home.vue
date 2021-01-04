<template>
  <layout>
    <div class="container">
      Home
    </div>
  </layout>
</template>
<script type="text/babel">
import Layout from 'framework/layout';
export default {
  components: {
    Layout
  },
  computed: {
    isLoading() {
      return false;
    },
    // articleList() {
    //   return this.$store.state.article.articleList;
    // }
  },
  // asyncData({ state, dispatch, commit }) {
  //   return dispatch('FETCH_ARTICLE_LIST');
  // }
};
</script>
