import axios from 'axios';
export default initState => {
  const name = 'article';
  const ssrState = initState[name];
  let state = {
    articleList: [],
    articleItem: {}
  };
  if (ssrState) {
    state = { ...state, ...ssrState };
  }
  const actions = {
    FETCH_ARTICLE_LIST: async ({ commit, dispatch, rootState, state }) => {
      if (!state.articleList.length) {
        const { data } = await axios.get(
          `${rootState.origin}/api/article/list`
        );
        if (data.list) {
          commit(SET_ARTICLE_LIST, data.list);
        }
        return data;
      }
    },

    FETCH_ARTICLE_DETAIL: async (
      { commit, dispatch, rootState, state },
      { id }
    ) => {
      if (state.articleItem.id !== Number(id)) {
        const { data } = await axios.get(
          `${rootState.origin}/api/article/${id}`
        );
        if (data) {
          commit(SET_ARTICLE_DETAIL, data);
        }
        return data;
      }
    },

    FETCH_ARTICLE_DATA: ({ commit, dispatch, rootState, state }) => {
      return Promise.all([
        dispatch('FETCH_ARTICLE_LIST'),
        dispatch('FETCH_ARTICLE_DETAIL', { id: '946940' })
      ])
        .then(response => {
          return response;
        })
        .catch(error => {
          console.log(error); // 失败了，打出 '失败'
        });
    }
  };

  const mutations = {
    SET_ARTICLE_LIST(state, items) {
      state.articleList = items;
    },
    SET_ARTICLE_DETAIL(state, data) {
      state.articleItem = data;
    }
  };

  return {
    state,
    actions,
    mutations
  };
};
