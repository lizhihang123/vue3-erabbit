<template>
  <!-- 顶部通栏 -->
  <AppTopnav />
  <!-- 头部内容 -->
  <AppHeader />
  <main>
      <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <!-- 底部 -->
  <AppFooter />
</template>

<script>
import AppTopnav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  components: {
    AppTopnav,
    AppHeader,
    AppFooter
  },
  setup() {
    const store = useStore()
    store.dispatch('category/getCategory')
    const list = computed(() => {
      return store.state.catagory.list
    })
    return { list }
  }
}
</script>

<style lang="less" scoped>
  // @import '../assets/styles/mixin.less';
  .container {
    // .box2();
    .hoverShadow();
  }
</style>
