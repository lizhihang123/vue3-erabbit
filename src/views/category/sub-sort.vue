<template>
  <div class='sub-sort'>
    <div class="sort">
      <a href="javascript:;"
      :class="{active: sortParams.sortField === null}"
      @click="changeSort(null)"
      >默认排序</a>
      <a href="javascript:;"
      :class="{active: sortParams.sortField === 'publishTime'}"
      @click="changeSort('publishTime')"
      >最新商品</a>
      <a href="javascript:;"
      :class="{active: sortParams.sortField === 'orderNum'}"
      @click="changeSort('orderNum')"
      >最高人气</a>
      <a href="javascript:;"
      :class="{active: sortParams.sortField === 'evaluateNum'}"
      @click="changeSort('evaluateNum')"
      >评论最多</a>
      <a href="javascript:;"
      @click="changeSort('price')"
      >
        价格排序
        <i class="arrow up" :class="{active: sortParams.sortMethod === 'asc'}" />
        <i class="arrow down" :class="{active: sortParams.sortMethod === 'desc'}" />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox @change="changeCheck" v-model="sortParams.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox @change="changeCheck" v-model="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'
export default {
  name: 'SubSort',
  setup(props, { emit }) {
    const sortParams = reactive({
      inventory: false, // 是否有货
      onlyDiscount: false, // 是否有优惠
      sortField: null, // 排序方式
      sortMethod: null // 价格 - 升序 降序
    })
    const changeSort = (sortField) => {
      // 1. 价格要做处理 如果是价格
      if (sortField === 'price') {
        sortParams.sortField = sortField
        if (sortParams.sortMethod === null) {
          // 1.1 第一次进入 默认是降序
          sortParams.sortMethod = 'desc'
        } else {
          // 1.2 取反的方式
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        // 如果不是价格 其它按钮
        // 2. 如果一个按钮点了好几次的话
        if (sortParams.sortField === sortField) return
        // 2.1 如果是第一次点 就赋值
        sortParams.sortField = sortField
        // 2.2 让升序和降序的按钮 字段为null 下次进入就是desc了
        sortParams.sortMethod = null
      }
      emit('change-sort', sortParams)
    }
    // 复选框改变
    const changeCheck = () => {
      emit('change-sort', sortParams)
    }
    return {
      sortParams,
      changeSort,
      changeCheck
    }
  }
}
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all .3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
            &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
