<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a href="javascript:;"
      class="iconfont icon-angle-left prev"
      @click="toggle(-1)"
      :class="{disabled: index === 0}"
      ></a>
      <a
      href="javascript:;"
      class="iconfont icon-angle-right next"
      @click="toggle(1)"
      :class="{disabled: index === 1}"
      ></a>
    </template>
    <div class="box" ref="box" v-if="brands" style="position: relative; height: 305px;">
        <Transition name="fade">
          <ul class="list"
          v-if="brands && brands.length"
          :style="{transform: `translateX(${-index*1240}px)`}">
            <li v-for="item in brands" :key="item.id">
              <RouterLink to="/">
                <img v-lazy="item.picture" alt="">
              </RouterLink>
            </li>
          </ul>
          <HomeBrandSkeleton v-else/>
        </Transition>
    </div>

  </HomePanel>
</template>

<script>
import HomePanel from './home-panel'
import HomeBrandSkeleton from './home-brandSkeleton.vue'
import { findBrand } from '@/api/home'
import { ref } from 'vue'
export default {
  name: 'HomeBrand',
  components: {
    HomePanel,
    HomeBrandSkeleton
  },
  setup() {
    const brands = ref([])
    const index = ref(0)
    findBrand().then(data => {
      brands.value = data.result
    })
    const toggle = (step) => {
      const newValue = index.value + step
      console.log(index)
      if (newValue > 1 || newValue < 0) return
      // 注意newValue的值 不是响应式数据 因此不用.value
      index.value = newValue
    }
    return {
      brands,
      toggle,
      index
    }
  }
}
</script>

<style scoped lang='less'>
.home-panel {
  background:#f5f5f5
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
</style>
