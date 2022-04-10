<template>
  <div class="list-wrapper">
    <div class="list-header van-hairline--top-bottom">
      <div :class="{ 'active': type === 'all' }" @touchend="changeType('all')">
        综合
      </div>
      <div :class="{ 'active': type === 'sale' }" @touchend="changeType('sale')">
        销量
      </div>
      <div
        class="price"
        :class="{
          'price-up': type === 'price-up',
          'price-down': type === 'price-down',
        }"
        @touchend="changeType('price')"
      >
        价格
      </div>
    </div>
    <div class="list-content">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有了"
          @load="onLoad"
          :immediate-check= "false"
        >
          <goods-card
            v-for="item in goodList"
            :key="item.id"
            v-bind="item"
            :num="counterMap[item.id]"
          ></goods-card>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import goodsCard from './GoodsCard.vue';

export default {
  data() {
    return {
      type: 'all',
      isLoading: false,
      finished: false,
      loading: false,
      page: 1,
    };
  },
  computed: {
    ...mapState({
      goodList: (state) => state.goodList,
      counterMap: (state) => state.counterMap,
    }),
  },
  components: {
    goodsCard,
  },
  methods: {
    onRefresh() {
      this.isLoading = true;
      this.finished = false;
      this.loading = false;
      this.page = 1;
      this.$store.commit('resetGoodsList');
      this.$store.dispatch('getGoodsList', { page: 1, sortType: this.type });
      this.isLoading = false;
    },
    async onLoad() {
      this.page += 1;
      this.loading = true;
      const result = await this.$store.dispatch('getGoodsList', { page: this.page, sortType: this.type });
      if (result) {
        this.loading = false;
      } else {
        this.finished = true;
      }
    },
    changeType(val) {
      if (val === 'price') {
        if (this.type === 'price-up') {
          this.type = 'price-down';
        } else {
          this.type = 'price-up';
        }
      } else {
        this.type = val;
      }
      this.onRefresh();
    },
  },
};
</script>

<style lang='less' scoped>
.list-header{
  width: 296px;
  height: 25px;
  position: relative;
  line-height: 25px;
  align-items: center;
  top: 0;
  left: 79px;
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
  padding: 0 8px;
  >div{
    width: 50px;
    height: 25px;
    text-align: center;
    color: #cecece;
  }
  .active, .price-up, .price-down{
    color: #ff1a90;
    font-weight: bold;
  }
  .price::after{
    content: '';
    border: 4px solid transparent;
    border-top-color: #aaa;
    position: absolute;
    bottom: 4px;
    right: 0;
  }
  .price::before{
    content: '';
    border: 4px solid transparent;
    border-bottom-color: #aaa;
    position: absolute;
    top: 4px;
    right: 0;
  }
  .price-up::before{
    border-bottom-color: #ff1a90;
  }
  .price-down::after{
    border-top-color: #ff1a90;
  }
}
.list-content{
  width: 296px;
  position: fixed;
  top: 170px;
  right: 0;
  bottom: 50px;
  overflow: auto;
}
.van-pull-refresh {
    overflow: unset!important;
  }
</style>
