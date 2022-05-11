<template>
  <div class="subHeaderNav">
    <div class="container">
      <!-- 1. 面包屑 -->
      <subBread />
      <!-- 2. 筛选区  -->
      <subFilter @change-filter="changeFilter" />
      <!-- 3. 结果区域 -->
      <div class="goods-list">
        <!-- 按钮区域 -->
        <sub-sort @change-sort="changeSort" />
        <!-- 商品区域 -->
        <ul>
          <li v-for="item in goodsList" :key="item.id">
            <goods-item :good="item" />
          </li>
        </ul>
        <!-- 无线加载列表区域 -->
        <XtxInfiniteLoading :loading="loading" :finished="finished" @infinite="getData" />
      </div>
    </div>
  </div>
</template>

<script>
import subBread from './sub-bread.vue'
import subFilter from './sub-filter.vue'
import subSort from './sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryGoods } from '@/api/category'
export default {
  name: 'subHeaderNav',
  components: {
    subBread,
    subFilter,
    subSort,
    GoodsItem
  },
  setup() {
    // 1. 加载 - 完成数据
    const finished = ref(false)
    const loading = ref(false)
    // 2. 路由获取id
    const route = useRoute()
    // 3. 商品数据
    const goodsList = ref([])
    // 4. 查询参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    // 5. 获取数据函数
    const getData = () => {
      loading.value = true
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          goodsList.value.push(...result.items)
          // 页码+1
          reqParams.page++
        } else {
          // 没数据了
          finished.value = true
        }
        // 只是这一次的加载关掉了
        loading.value = false
      })
    }
    // 切换二级分类时也要发请求
    watch(() => route.params.id, (newVal) => {
      if (newVal && route.path === `/category/sub/${newVal}`) {
        // 清空数组 自然而然回到页面可视区
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        }
        finished.value = false
      }
    })
    // 6. 筛选
    const changeFilter = (filterParams) => {
      // filterParams [{groupName: '米数', propertyName: '霸道大物-超轻版4.5米'}]
      reqParams = {
        ...reqParams,
        ...filterParams
      }
      reqParams.page = 1
      goodsList.value = [] // 清空数组
      finished.value = false // 表示还没有加载完
    }
    // 7. 排序
    const changeSort = (sortParams) => {
      // 1. 思考这里的数据 为什么能够发生变化
      // sortParams 数据来自组件 sub-sort传递来的, 里面的
      //   const sortParams = reactive({
      // inventory: false, // 是否有货 -> 来自复选框
      //   onlyDiscount: false, // 是否有优惠 -> 来自复选框
      //   sortField: null, // 排序方式 -> 来自排序方式勾选
      //   sortMethod: null // 价格 - 升序 降序 -> 来自排序方式勾选
      // })
      // 2. 参数处理 想办法发请求
      // 保留之前的参数，替换变化的参数
      console.log(sortParams)
      reqParams = { ...reqParams, ...sortParams }
      // 页码必须变为1
      reqParams.page = 1
      // 商品清空 -> 商品回到顶部
      goodsList.value = []
      // 改变finished的状态
      finished.value = false
    }
    return {
      finished,
      loading,
      goodsList,
      getData,
      changeFilter,
      changeSort
    }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}

</style>
