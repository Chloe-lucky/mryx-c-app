<template>
  <div class="search-wrapper">
    <div class="search-head">
      <van-icon name="arrow-left" class="arr-left" @click="$router.goBack()"/>
      <van-search
      class="search-content"
        v-model="value"
        show-action
        :placeholder="place"
        @search="onSearch"
        @input="input"
        @focus="focus"
      >
      <template #action v-if="showList">
        <div @touchend='onSearch(value)'>搜索</div>
      </template>
      <template #action v-else>
        <router-link tag="div" id="shop-car" class="shop-car" :to="{name:'shopping'}">
        <van-icon name="shopping-cart-o" :badge="badge"/>
        </router-link>
      </template>
      </van-search>
    </div>
    <div class="like-search" v-if="likeList.length && showList">
      <van-list>
        <van-cell v-for="item in likeList" :key="item" @click="onSearch(item)">
          <template #title>
            <span class="custom-title" v-html="formatHTML(item)"></span>
          </template>
        </van-cell>
      </van-list>
    </div>
    <div class="goods-list" v-if="!showList">
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
    </div>
    <div class="my-history" v-if="likeList.length <= 0 && showList">
      <my-history :searchList='searchList' @search='onSearch'></my-history>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '../api/index';
import goodsCard from '../components/GoodsCard.vue';
import myHistory from '../components/MyHistory.vue';

export default {
  data() {
    return {
      place: '酒',
      value: this.place,
      likeList: [],
      timer: null,
      loading: false,
      finished: false,
      page: 1,
      size: 5,
      goodList: [],
      showList: true,
      total: 0,
      searchList: [],
    };
  },
  computed: {
    ...mapState({
      counterMap: (state) => state.counterMap,
    }),
    badge() {
      const count = Object.values(this.counterMap).reduce(
        (prev, next) => prev + next,
        0,
      );
      if (count > 99) {
        return '99+';
      }
      return count;
    },
  },
  methods: {
    onLoad() {
      this.page += 1;
      api.search({
        page: this.page,
        size: this.size,
        type: this.value,
      }).then((res) => {
        this.total = res.total;
        this.goodList = [...this.goodList, ...res.list];
        this.loading = false;
      });
      if (this.goodList.length >= this.total) {
        this.finished = true;
      }
    },
    onSearch(val) {
      if (val) {
        this.value = val;
      }
      this.finished = false;
      this.likeList = [];
      if (this.value === '') {
        this.value = this.place;
      }
      const result = this.searchList.find((item) => item.value === this.value);
      if (result) {
        result.time = new Date().getTime();
        this.searchList.sort((a, b) => b.time - a.time);
      } else {
        this.searchList.unshift({ value: this.value, time: new Date().getTime() });
        if (this.searchList.length >= 11) {
          this.searchList.pop();
        }
      }
      // this.searchList.unshift({ value: this.value, time: new Date().getTime() });
      localStorage.setItem('searchList', JSON.stringify(this.searchList));
      this.goodList = [];
      this.page = 1;
      api.search({
        page: this.page,
        size: this.size,
        type: this.value,
      }).then((res) => {
        this.total = res.total;
        this.goodList = [...this.goodList, ...res.list];
        this.showList = false;
      });
    },
    // 防抖
    input() {
      if (this.value === '') {
        this.likeList = [];
        return;
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      } else {
        this.timer = setTimeout(() => {
          api.likeSearch({ likeValue: this.value }).then((res) => {
            console.log('likeSearch', this.value, res);
            this.likeList = res.result;
            clearTimeout(this.timer);
            this.timer = null;
          });
        }, 30);
      }
    },
    focus() {
      this.showList = true;
    },
    formatHTML(item) {
      const reg = new RegExp(this.value, 'g');
      return item.replace(reg, this.value.fontcolor('red'));
    },
  },
  components: {
    goodsCard, myHistory,
  },
  created() {
    this.searchList = JSON.parse(localStorage.getItem('searchList')) || [];
  },
};
</script>

<style lang='less' scoped>
.search-wrapper{
  width: 100%;
  height: 100px;
  z-index: 10;
  background: #fff;
  .search-head{
    width: 345px;
    background: #fff;
    margin: 0 auto;
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 15px;
    z-index: 22;
    .arr-left{
      font-size: 22px;
    }
    .search-content{
      flex: 1;
      .shop-car{
        font-size: 15px;
      }
    }
  }
  .like-search{
    position: relative;
    top: 50px;
    width: 100%;
    box-sizing: border-box;
    padding-left: 30px;
  }
  .goods-list{
    position: relative;
    width: 345px;
    margin: 48px auto 0;
    z-index: 10;
    background: #fff;
  }
  .my-history{
    width: 350px;
    position: absolute;
    top: 35px;
    left: 10px;
    z-index: 1;
  }
}
</style>
