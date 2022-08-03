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
        <!-- 商品详情 -->
        <div class="spec">
          <!-- 商品名称 -->
          <goods-name :goods="goods" />
          <!-- 商品的sku -->
          <goods-sku :goods="goods" @change="changSku" skuId="300475195" />
          <!-- 商品数量 -->
          <xtx-number :max="goods.inventory" label="数量" v-model="num" />
          <!-- 收藏 -->
          <div class="favorite" title="收藏" @click="collect(goods)">
            <div class="top">
              <i :class="{active: goods.isCollect}" class="iconfont icon-favorite-filling"></i>
            </div>
            <div class="bottom">
              <p>收藏</p>
            </div>
          </div>
          <!-- 按钮组件 - 加入购物车 -->
          <xtx-button @click="insertCart" type="primary" style="margin-top: 20px">加入购物车</xtx-button>
        </div>
      </div>
      <!-- 3. 商品推荐 -->
      <goods-relevant :goodsId="goods.id" />
      <!-- 4. 商品底部信息 -->
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
  <div class="loading" v-else>
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
import { useStore } from 'vuex'
import { findGoods } from '@/api/product'
import Message from '@/components/library/Message'
import { collectGoods, batchCollectGoods } from '@/api/goods'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsName, GoodsSales, GoodsSku, GoodsTab, GoodsHot, GoodsWarn },
  setup() {
    const goods = useGoods()
    // goods 接受 useGoods方法返回的所有商品
    const changSku = (sku) => {
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.inventory = sku.inventory
        goods.value.oldPrice = sku.oldPrice
        // 如果点击sku 就会修改当前选中的currSku的值
        currSku.value = sku
      } else {
        currSku.value = null
      }
    }
    // 商品的数量
    const num = ref(1)
    // 提供商品详情数据
    provide('goods', goods)

    // store
    const store = useStore()
    // 当前选中的sku的值
    const currSku = ref(null)
    // 增加商品至购物车
    const insertCart = () => {
      if (!currSku.value) {
        Message({
          text: '请选择商品规格'
        })
        return
      }
      // id - 商品的id
      // skuId - skuId
      // name - 商品名称
      // attrsText - 属性文字
      // picture - 商品图片
      // price - 加入时的价格
      // nowPrice - 当前的价格
      // selected - 是否选中
      // stock - 库存
      // count - 数量
      // discount - 折扣信息
      // isCollect - 是否收藏
      // isEffective - 是否为有效商品

      // 解构赋值

      // var o = { p: 42, q: true }
      // var { p: foo, q: bar } = o // foo是新的变量名 p是旧的变量名
      const { id, name, price, mainPictures: picture } = goods.value
      // 为了以防 里面没有skuId 先手一波进行判断 赋值为null 这句代码好像没起作用
      // if (!currSku.value.skuId) {
      //   currSku.value.skuId = null
      // }

      // 有时候skuId会被识别为undefined 但是其实每个商品都会有skuId的 这里就有点奇怪了
      const { skuId, specsdText: attrsText, inventory: stock } = currSku.value
      const count = num.value
      store.dispatch('cart/insertCart', {
        id: id,
        name: name,
        picture: picture[0],
        skuId: skuId,
        price: price,
        nowPrice: price,
        attrsText: attrsText,
        stock: stock,
        count: count,
        isEffective: true,
        selected: true
      }).then(() => {
        Message({
          type: 'success',
          text: '添加购物车成功'
        })
      }).catch(error => {
        console.log(error)
        Message({
          type: 'error',
          text: error
        })
      })
    }

    // 收藏商品
    const collect = () => {
      // 未收藏 点击收藏
      if (!goods.value.isCollect) {
        // 调接口 收藏商品
        collectGoods([goods.value.id], 1).then(data => {
          goods.value.isCollect = true
        })
      } else {
        // 已经收藏 调接口 取消收藏
        batchCollectGoods([goods.value.id], 1).then(data => {
          goods.value.isCollect = false
        })
      }
    }

    return {
      goods,
      changSku,
      num,
      insertCart,
      currSku,
      collect
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
.favorite {
  display: inline-block;
  height: 45px;
  width: 50px;
  text-align: center;
  vertical-align: middle;
  border: 1px solid @xtxColor;
  margin-right: 10px;
  cursor: pointer;
  i {
    &.active {
      color: @xtxColor;
    }
  }
}
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
.loading {
    height: 600px;
    width: 100%;
    background: url(../../assets/images/loading.gif) no-repeat center;
}
</style>
