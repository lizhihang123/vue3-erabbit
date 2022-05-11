<template>
<!-- 筛选区 -->
   <div class="sub-filter" v-if="filterData && !filterLoading">
     <!-- 第一行品牌筛选 -->
     <div class="item">
       <div class="head">品牌：</div>
       <div class="body">
         <a
         :class="{active: item.id === filterData.selectBrand}" href="javascript:;"
         v-for="item in filterData.brands"
         :key="item.id"
         @click="changeBrand(item.id)"
         >{{item.name}}</a>
       </div>
     </div>

     <!-- 其它分类的筛选 -->
     <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
       <div class="head">{{item.name}}</div>
       <div class="body">
         <a
         :class="{active: prop.id === item.selectProp}" href="javascript:;"
         v-for="prop in item.properties"
         :key="prop.is"
        @click="changeAttr(item, prop.id)"
         >{{prop.name}}</a>
       </div>
     </div>
   </div>

   <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
   </div>
</template>
<script>
import { findSubCategoryFilter } from '@/api/category'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
export default {
  name: 'SubFilter',
  setup(props, { emit }) {
    const filterData = ref(null)
    const route = useRoute()
    let filterLoading = false
    // brands -> 品牌数据 有几个品牌 一行的
    // saleProperties -> 有几个分类 好几行的 比如颜色和尺码
    //     properties -> 比如颜色里面有几个分类
    watch(() => route.params.id, (newVal, oldVal) => {
      if (newVal && route.path === `/category/sub/${newVal}`) {
        findSubCategoryFilter(route.params.id).then(({ result }) => {
          // 增加全部
          result.brands.unshift({ id: null, name: '全部' })
          // 全部 初始化 变绿
          result.selectBrand = null
          result.saleProperties.forEach(p => {
            // 增加全部
            p.properties.unshift({ id: null, name: '全部' })
            // 全部初始化变绿
            p.selectProp = null
          })
          // 数据赋值
          filterData.value = result
          // 用于骨架屏
          filterLoading = false
        })
      }
    }, {
      immediate: true
    })

    // 改变筛选的参数
    const getFilterParams = () => {
      const obj = { brandId: null, attrs: [] }
      // 品牌处理
      obj.brandId = filterData.value.selectBrand
      // 分类的处理
      filterData.value.saleProperties.forEach((item, index) => {
        // 如果当前的这个分类有被选中了
        if (item.selectProp) {
          // 找到被选中的那个小分类 比如颜色里面的红色这一项
          const attr = item.properties.find(attr => attr.id === item.selectProp)
          if (attr && attr.id !== undefined) {
            // 红色的名字和颜色的名字组成分类 给到obj.attrs
            obj.attrs.push({ groupName: item.name, propertyName: attr.name })
          }
        }
      })
      if (obj.attrs.length === 0) {
        obj.attrs = null
      }
      // 这里没打印出来
      return obj
    }
    // 选择品牌
    const changeBrand = (brandId) => {
      if (filterData.value.selectBrand === brandId) {
        return
      }
      filterData.value.selectBrand = brandId
      emit('change-filter', getFilterParams())
    }
    // 选择其它分类
    const changeAttr = (p, attrId) => {
      if (p.selectProp === attrId) {
        return
      }
      p.selectProp = attrId
      emit('change-filter', getFilterParams())
    }
    return {
      filterData,
      filterLoading,
      getFilterParams,
      changeBrand,
      changeAttr
    }
  }
}
</script>
<style scoped lang='less'>
  // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
    .xtx-skeleton {
        padding: 10px 0;
    }
  }
</style>
