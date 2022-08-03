<template>
  <div class="top-category">
    <div class="container">
      <!-- 1. 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <Transition name="fade-right" mode="out-in">
            <XtxBreadItem :key="topCategory.id">{{ topCategory.name }}</XtxBreadItem>
        </Transition>
      </XtxBread>
      <!-- 2. 轮播图 -->
      <XtxCarousel :slider="slider" style="height: 500px" />
      <!-- 3. 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in topCategory.children" :key="sub.id">
            <RouterLink :to="`/category/sub/${sub.id}`">
              <img :src="sub.picture" />
              <p>{{ sub.name }}</p>
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- 4. 分类关联商品 -->
      <div class="ref-goods" v-for="item in subList" :key="item.id">
        <div class="head">
          <h3>- {{item.name}} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <XtxMore :path="`/category/sub/${item.id}`"/>
        </div>
        <div class="body">
          <GoodsItem v-for="good in item.goods" :key="good.id" :good="good"  />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { findBanner } from '@/api/home'
import { findTopCategory } from '@/api/category'
import GoodsItem from './components/goods-item.vue'
export default {
  name: 'category',
  components: {
    GoodsItem
  },
  setup() {
    // 轮播图的数据
    const slider = ref([])
    findBanner().then((data) => {
      slider.value = data.result
    })
    const store = useStore()
    const route = useRoute()
    // 指定的分类数据
    const topCategory = computed(() => {
      let cate = {}
      const item = store.state.category.list.find((item) => {
        return item.id === route.params.id
      })
      if (item) {
        cate = item
      }
      console.log(item)
      console.log(cate)
      return cate
    })
    // 分类关联的商品数据
    // 如果只在这里发请求 只会在setup组件初始化一次触发(分类和商品会变化是因为计算属性 但是组件并没有初始化)
    const subList = ref([])
    const getTopCategory = () => {
      findTopCategory(route.params.id).then(data => {
        subList.value = data.result.children
      })
    }
    // 需要侦听器 监听路由的变化
    watch(() => route.params.id, (newVal) => {
      // newVal && getTopCategory()
      // 二级路由 不会发送请求
      if (newVal && `/category/${newVal}` === route.path) {
        getTopCategory()
      }
    }, {
      immediate: true
    })
    return {
      topCategory,
      slider,
      subList
    }
  }
}
</script>

<style scoped lang="less">
.fade-right-enter-from,
.fade-right-leave-to{
  opacity: 0;
  transform: translateX(20px);
}
.fade-right-enter-active,
.fade-right-leave-active{
  transition: all 0.2s;
}
.fade-right-enter-to,
.fade-right-leave-from{
  opacity: 1;
  transform: none;
}

.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
    .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
