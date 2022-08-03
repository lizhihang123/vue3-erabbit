<template>
  <div class='home-new'>
    <HomePanel  title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
        <template #right>
          <xtx-more path="/" />
        </template>
        <div style="position: relative; height: 406px" ref="target">
          <Transition name="fade">
            <!-- 面板内容 -->
              <ul v-if="goods && goods.length" class="goods-list">
                <li v-for="item in goods" :key="item.id">
                  <RouterLink :to="`/product/${item.id}`">
                    <img v-lazy="item.picture" alt="">
                    <p class="name ellipsis">{{item.title}}</p>
                    <p class="price">&yen;100</p>
                  </RouterLink>
                </li>
              </ul>
              <home-skeleton v-else bg="#f0f9f4"/>
          </Transition>
          </div>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from './home-panel.vue'
import { findNew } from '@/api/home.js'
// import { ref } from 'vue'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks/index.js'
export default {
  name: 'HomeNew',
  components: {
    HomePanel,
    HomeSkeleton
  },
  setup() {
    const { result, target } = useLazyData(findNew)
    console.log('111', result)
    return { goods: result, target }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
