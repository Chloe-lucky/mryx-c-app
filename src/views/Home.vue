<template>
  <div class="home">
    <router-view></router-view>
    <tab-bar></tab-bar>
  </div>
</template>

<script>
import TabBar from '../components/TabBar.vue';

export default {
  components: {
    TabBar,
  },
};
</script>
