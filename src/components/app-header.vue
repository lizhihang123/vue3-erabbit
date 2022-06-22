<template>
  <header class='app-header'>
    <div class="container">
      <h1 class="logo"><RouterLink to="/">小兔鲜</RouterLink></h1>
      <!-- 吸顶头部 -->
      <AppHeaderSticky />
      <!-- 头部导航 -->
      <AppHeaderNav :class="{hide: y >= 78}" />
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜">
      </div>
      <!-- 购物车的小图标 -->
      <!-- <div class="cart">
        <a class="curr" href="#">
          <i class="iconfont icon-cart"></i><em>2</em>
        </a>
      </div> -->
      <AppHeaderCart />
    </div>
  </header>
</template>

<script>
import AppHeaderNav from '@/components/app-header-nav.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import AppHeaderCart from '@/components/app-header-cart.vue'
// import { onMounted, ref } from 'vue'
import { useWindowScroll } from '@vueuse/core'
export default {
  name: 'AppHeader',
  components: {
    AppHeaderNav,
    AppHeaderSticky,
    AppHeaderCart
  },
  setup() {
    // const y = ref(0)
    // onMounted(() => {
    //   window.onscroll = () => {
    //     const srcollTop = document.documentElement.srcollTop
    //     console.log(srcollTop)
    //     y.value = srcollTop
    //   }
    // })
    const { y } = useWindowScroll()
    return { y }
  }

}
</script>

<style scoped lang='less'>
.app-header {
  background: #fff;
  &.hide {
      transition: all .3s linear;
      transform: none;
      opacity: 0;
  }
  .container {
    display: flex;
    align-items: center;
  }
  .logo {
    width: 200px;
    a {
      display: block;
      height: 132px;
      width: 100%;
      text-indent: -9999px;
      background: url(../assets/images/logo.png) no-repeat center 18px / contain;
    }
  }

  .search {
    width: 170px;
    height: 32px;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
    line-height: 32px;
    .icon-search {
      font-size: 18px;
      margin-left: 5px;
    }
    input {
      width: 140px;
      padding-left: 5px;
      color: #666;
    }
  }
  .cart {
    width: 50px;
    .curr {
      height: 32px;
      line-height: 32px;
      text-align: center;
      position: relative;
      display: block;
      .icon-cart{
        font-size: 22px;
      }
      em {
        font-style: normal;
        position: absolute;
        right: 0;
        top: 0;
        padding: 1px 6px;
        line-height: 1;
        background: @helpColor;
        color: #fff;
        font-size: 12px;
        border-radius: 10px;
        font-family: Arial;
      }
    }
  }
}
</style>
