<template>
  <div class="member-home">
      <!-- 概览 -->
      <HomeView />
      <!-- 收藏 -->
      <HomePanel title="我的收藏">
          <GoodsItem v-for="item in collectGoods" :key="item.id" :good="item">
          </GoodsItem>
      </HomePanel>

      <!-- 下面没有遍历好 -->
      <!-- 足迹 -->
      <HomePanel title="我的足迹">
          <GoodsItem v-for="foot in browserGoods" :key="foot.id" :good="foot">
          </GoodsItem>
      </HomePanel>
      <!-- 猜你 -->
      <GoodsRelevant />
      <!-- <button @click="fn">点我测试</button> -->
      <HomeTest>
        <span class="good">
          我来测试插槽语法
        </span>
      </HomeTest>
      <span class="test">我来测试全局作用域语法</span>
  </div>
</template>

<script>
import HomeView from './components/home-overview'
import HomePanel from './components/home-panel'
import GoodsRelevant from '@/views/goods/component/goods-relevant'
import GoodsItem from '@/views/category/components/goods-item'
import HomeTest from './components/home-test'
import { ref } from 'vue'
import { findBrowerHistory, findCollect } from '@/api/member'
// import { request } from '@/utils/request'
export default {
  name: 'MemberHome',
  components: {
    HomeView,
    HomePanel,
    GoodsRelevant,
    GoodsItem,
    HomeTest
  },
  setup() {
    // const good = {
    //   id: '1',
    //   name: '自煮火锅不排队 麦饭石不粘鸳鸯火锅',
    //   picture: 'https://yanxuan-item.nosdn.127.net/fcdcb840a0f5dd754bb8fd2157579012.jpg',
    //   desc: '清汤鲜香 红汤劲爽',
    //   price: '159.00'
    // }
    // const good = ref(null)
    // my/test测试mockjs
    // request('/my/test', 'get').then(data => {
    //   good.value = data.result
    //   console.log(data)
    // })

    const collectGoods = ref(null)
    findCollect().then(data => {
      collectGoods.value = data.result.items
    })

    const browserGoods = ref(null)
    findBrowerHistory().then(data => {
      console.log(data)
      browserGoods.value = data.result.items
    })
    // const fn = ({ a = 10, b = 100 }) => {
    //   console.log(a)
    //   console.log(b)
    //   console.log(a + b)
    // }
    // fn()
    return {
      // good,
      collectGoods,
      browserGoods
    }
  }
}
</script>
<style scoped lang="less">
:deep(.goods-list) {
display: flex;
justify-content: space-around;
padding-top: 20px;
}
</style>
