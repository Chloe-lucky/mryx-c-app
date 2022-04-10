import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/index';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sideList: [],
    showContent: false,
    size: 5,
    goodList: [],
    type: null,
    counterMap: {},
  },
  mutations: {
    storageChange(state, { id, value }) {
      if (state.counterMap[id]) {
        if ((value === -1 && state.counterMap[id] === 1) || value === -Infinity) {
          Vue.delete(state.counterMap, id);
        } else {
          Vue.set(state.counterMap, id, state.counterMap[id] + value);
        }
      } else {
        Vue.set(state.counterMap, id, 1);
      }
      localStorage.setItem('goods', JSON.stringify(state.counterMap));
    },
    setCounterMap(state, map) {
      state.counterMap = map;
    },
    setSideList(state, list) {
      state.sideList = list;
    },
    setShowContent(state, bool) {
      state.showContent = bool;
    },
    setGoodList(state, list) {
      state.goodList = [...state.goodList, ...list];
    },
    resetGoodsList(state) {
      state.goodList = [];
    },
    setGoodsType(state, type) {
      state.type = type;
    },
  },
  actions: {
    async setSideList({
      commit,
    }, type) {
      commit('setShowContent', false);
      await api.getSideList(type).then((res) => {
        commit('setSideList', res);
        commit('setShowContent', true);
      });
    },
    async getGoodsList({
      state,
      commit,
    }, options) {
      const {
        page,
        sortType,
      } = options;
      const type = options.type || state.type;
      const {
        list,
        total,
      } = await api.getGoodsList({
        page,
        type,
        size: state.size,
        sort: sortType,
      });
      commit('setGoodList', list);
      commit('setGoodsType', type);
      if (total > state.goodList.length) {
        return true;
      }
      return false;
    },
  },
  modules: {},
});
