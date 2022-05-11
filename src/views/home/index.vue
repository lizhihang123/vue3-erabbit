<template>
  <div class="page-home">
    <div class="home-entry">
      <div class="container">
        <!-- 1. 左侧分类 -->
        <HomeCategory />
        <!-- 2. 轮播图 -->
        <home-banner />
        <!-- 3. 新鲜好物 -->
        <home-new />
        <!-- 4. 人气推荐 -->
        <home-hot />
        <!-- 5. 热门品牌 -->
        <home-brand />
        <!-- 6. 商品区块 -->
        <home-product />
        <!-- 7. 特殊商品 -->
        <home-special />
      </div>
    </div>
  </div>
</template>
<script>
import HomeBanner from './components/home-banner.vue'
import HomeCategory from './components/home-category.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
import HomeBrand from './components/home-brand.vue'
import HomeProduct from './components/home-product.vue'
import HomeSpecial from './components/home-special.vue'
export default {
  name: 'PageHome',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  }
}
</script>
<style >
</style>
