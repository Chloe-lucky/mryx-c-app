<template>
  <div class="classify-wrapper">
    <router-link class="search-btn" tag="div" to="/search">
      <van-icon name="search" />
      <div>苹果特价1元1斤</div>
    </router-link>
    <one-tab></one-tab>
    <template v-if="showContent">
      <side-bar></side-bar>
      <goods-list></goods-list>
    </template>
   <van-loading class="center" size="1.3rem" color="pink" v-else />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import oneTab from '../components/OneTab.vue';
import sideBar from '../components/SideBar.vue';
import goodsList from '../components/GoodsList.vue';

export default {
  components: {
    oneTab,
    sideBar,
    goodsList,
  },
  computed: {
    ...mapState({
      showContent: (state) => state.showContent,
      sideList: (state) => state.sideList,
    }),
  },
  watch: {
    showContent() {
      if (this.showContent) {
        this.$store.commit('resetGoodsList');
        this.$store.dispatch('getGoodsList', { type: this.sideList[0], page: 1, sortType: 'all' });
      }
    },
  },
};
</script>

<style lang='less' scoped>
// .classify-wrapper {
//   width: 375px;
//   .search-btn {
//     width: 355px;
//     height: 33px;
//     line-height: 33px;
//     background-color: #eee;
//     margin: 11px auto 0;
//     border-radius: 10px;
//     font-size: 14px;
//     text-align: center;
//     color: #a1a1a1;
//     > * {
//       display: inline-block;
//       vertical-align: middle;
//     }
//   }
// }
.classify-wrapper {
    width: 375px;
  // width: 100%;
  // min-height: 100vh;
  // position: absolute;
  // font-size: 14px;
  // overflow: hidden;
  .search-btn {
    height: 31.5px;
    line-height: 31.5px;
    width: 355px;
    margin: 10.76px auto 0;
    background: #eee;
    border-radius: 10px;
    text-align: center;
    color: #a1a1a1;
    >* {
      vertical-align: middle;
      display: inline-block;
    }
  }
}
</style>
