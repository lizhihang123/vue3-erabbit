<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">
      <!-- 1. 面包屑 -->
      <xtx-bread >
          <xtx-bread-item to="/">首页</xtx-bread-item>
          <xtx-bread-item :to="`/category/${goods.categories[0].id}`">{{goods.categories[0].name}}</xtx-bread-item>
          <xtx-bread-item :to="`/category/sub/${goods.categories[1].id}`">{{goods.categories[1].name}}</xtx-bread-item>
          <xtx-bread-item>{{goods.name}}</xtx-bread-item>
      </xtx-bread>
      <!-- 2. 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <goods-image :images="goods.mainPictures"/>
          <goods-sales />
        </div>
        <div class="spec">
          <!-- 商品名称 -->
          <goods-name :goods="goods" />
          <!-- 商品的sku -->
          <goods-sku :goods="goods" @change="changSku" skuId="300475195" />
          <!-- 商品数量 -->
          <xtx-number :max="goods.inventory" label="数量" v-model="num" />
          <!-- 按钮组件 - 加入购物车 -->
          <xtx-button type="primary" style="margin-top: 20px">加入购物车</xtx-button>
        </div>
      </div>
      <!-- 3. 商品推荐 -->
      <goods-relevant :goodsId="goods.id" />
      <!-- 4. 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs">
            <goods-tab />
          </div>
          <!-- 注意事项 -->
          <div class="goods-warn">
            <goods-warn />
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <goods-hot :goodsId="goods.id" :type="1" />
          <goods-hot :goodsId="goods.id" :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './component/goods-relevant.vue'
import GoodsImage from './component/goods-image.vue'
import GoodsName from './component/goods-name.vue'
import GoodsSku from './component/goods-sku.vue'
import GoodsSales from './component/goods-sales.vue'
import GoodsTab from './component/goods-tab.vue'
import GoodsHot from './component/goods-hot.vue'
import GoodsWarn from './component/goods-warn.vue'
import { nextTick, ref, watch, provide } from 'vue'
import { useRoute } from 'vue-router'
import { findGoods } from '@/api/product'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsName, GoodsSales, GoodsSku, GoodsTab, GoodsHot, GoodsWarn },
  setup() {
    const goods = useGoods()
    // goods 接受 useGoods方法返回的所有商品

    const changSku = (sku) => {
      if (sku) {
        goods.value.price = sku.price
        goods.value.inventory = sku.inventory
        goods.value.oldPrice = sku.oldPrice
      }
    }
    // 商品的数量
    const num = ref(1)
    // 提供商品详情数据
    provide('goods', goods)
    return {
      goods,
      changSku,
      num
    }
  }
}
const useGoods = () => {
  const goods = ref(null)
  const route = useRoute()
  // 加侦听器 检测路由id的变化 并且要有新的值 且新的值是商品详情的路由id 而不是其它页面的id
  watch(() => route.params.id, (newVal) => {
    if (newVal && route.path === `/product/${newVal}`) {
      findGoods(route.params.id).then(data => {
        // 把商品的数据置为空，假如这个页面的其它组件比如goods-relevant添加了v-if，就会被销毁，然后有新的数据了，就能够显示
        // 假如没有置为空，此时goods第一次是null -> 有值 后面是有值 -> 有值，就不会触发更新了
        goods.value = null
        // 这句代码 -> 如果goods.value = null和goods.value = data.result写在一起，v-if会认为值不是空
        nextTick(() => {
          goods.value = data.result
        })
      })
    }
  }, {
    immediate: true
  })
  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
