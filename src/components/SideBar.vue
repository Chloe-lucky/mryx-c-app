<template>
  <div class="sidebar-wrapper" ref="side">
    <div
      v-for="(item, i) in sideList"
      :key="i"
      :class="{ active: i === index }"
      @touchend="scrollTo(i, $event)"
      @touchstart="move = false"
      @touchmove="move = true"
    >
      {{ i === 0 ? '全部' : item }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import tool from '../util/tool';

export default {
  data() {
    return {
      index: 0,
      move: false,
    };
  },
  computed: {
    ...mapState({
      sideList: (state) => state.sideList,
    }),
  },
  methods: {
    scrollTo(i, e) {
      if (this.move) {
        return;
      }
      this.index = i;
      const { side } = this.$refs;
      const itemHeight = e.target.offsetHeight;
      const itemTop = e.target.getBoundingClientRect().top;
      const wrapperHeight = side.offsetHeight;
      const wrapperTop = side.getBoundingClientRect().top;
      tool.moveTo(
        side.scrollLeft,
        itemTop + itemHeight / 2 - wrapperTop - wrapperHeight / 2,
        side,
        'scrollTop',
      );
      this.$store.commit('resetGoodsList');
      this.$store.dispatch('getGoodsList', {
        type: this.sideList[i],
        page: 1,
        sortType: 'all',
      });
    },
  },
  // mounted() {
  //   this.$store.commit('resetGoodsList');
  //   this.$store.dispatch('getGoodsList', {
  //     type: this.sideList[0],
  //     page: 1,
  //     sortType: 'all',
  //   });
  // },
};
</script>

<style lang='less' scoped>
.sidebar-wrapper {
  position: fixed;
  left: 0px;
  width: 79px;
  top: 135px;
  bottom: 50px;
  overflow: auto;
  background: #f8f8f8;
  div {
    width: 79px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    position: relative;
    &.active {
      font-weight: bold;
      color: #ff1a90;
    }
    &.active::before {
      position: absolute;
      width: 6px;
      height: 18px;
      background: #ff1a90;
      top: 50%;
      transform: translateY(-50%);
      content: "";
      left: 0;
    }
  }
}
.sidebar-wrapper::-webkit-scrollbar {
  width: 0px;
  background: none;
}
</style>
