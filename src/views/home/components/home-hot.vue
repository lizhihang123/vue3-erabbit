<template>
  <div class='home-hot'>
    <HomePanel title="人气推荐" subTitle="人气爆款 不容错过">
      <div style="position: relative; height: 426px" ref="target">
        <Transition name="fade">
          <ul v-if="list.length"  class="goods-list" >
            <li v-for="item in list" :key="item.id">
              <RouterLink to="/">
                <img v-lazy="item.picture" alt="">
                <p class="name">{{item.title}}</p>
                <p class="desc">{{item.alt}}</p>
              </RouterLink>
            </li>
          </ul>
          <home-skeleton v-else bg="#f0f9f4" />
        </Transition>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from './home-panel.vue'
import { findHot } from '@/api/home.js'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks/index.js'
export default {
  name: 'HomeHot',
  components: {
    HomePanel,
    HomeSkeleton
  },
  setup() {
    const { result, target } = useLazyData(findHot)
    // findHot().then(res => {
    //   list.value = res.result
    // })
    return { list: result, target }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
