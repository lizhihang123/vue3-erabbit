<template>
  <div class="xtx-pagination">
    <!-- 这个上一页不能点 当前页小于等于1 -->
    <a v-if="myCurrentPage <= 1" href="javascript:;" class="disabled">上一页</a>
    <!-- 这个上一页能点 当前页大于1 -->
    <a v-else href="javascript:;" @click="changePage(--myCurrentPage)">上一页</a>
    <!-- 起始页大于1 就能够显示... -->
    <span v-if="pager.start > 1">...</span>
    <a
    v-for="i in pager.btnArr"
    href="javascript:;"
    :key="i"
    :class="{active: myCurrentPage === i}"
    @click="changePage(i)">{{ i }}</a>
    <!-- 结尾页小于总页码数 就能够显示... -->
    <span v-if="pager.end < pager.pageCount">...</span>
    <!-- 这个下一页不能点 -->
    <a v-if="myCurrentPage >= pager.pageCount" href="javascript:;" class="disabled">下一页</a>
    <!-- 这个下一页能够点 当前页小于总页数 -->
    <a v-else href="javascript:;" @click="changePage(++myCurrentPage)">下一页</a>
  </div>
</template>
<script>
import { ref, computed, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    // 每页条数
    pageSize: {
      type: Number,
      default: 10
    },
    // 当前页码
    currentPage: {
      type: Number,
      default: 1
    },
    // 总页数
    total: {
      type: Number,
      default: 100
    }
  },
  setup(props, { emit }) {
    // 总条数
    const myTotal = ref(100)
    // 每页条数
    const myPageSize = ref(10)
    // 当前第几页
    const myCurrentPage = ref(1)
    // 按钮个数 按钮个数无需响应式
    const btnCount = 5

    // 重点 根据上述数据 得到总页数 起始页码 结束页码 按钮数组
    const pager = computed(() => {
      // 计算总页数 = 数据的总条数 / 每页的数据的数量 再要向上取整
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 计算偏移量
      const offset = Math.floor(btnCount / 2)
      // 计算起始页码
      let start = myCurrentPage.value - offset
      let end = start + btnCount - 1
      // 如果开始页码小于1 就让他等于1
      if (start < 1) {
        start = 1
        // 如果结束页码超出了总页数 就让他等于最后一页
        end = (start + btnCount - 1) > pageCount ? pageCount : (start + btnCount - 1)
      }
      // 如果结束页码大于总页数 处理
      if (end > pageCount) {
        end = pageCount
        // 同样 如果开始页码小于1 就让他等于 1
        start = (end - btnCount + 1) < 1 ? 1 : (end - btnCount + 1)
      }
      // 处理完毕start和end得到按钮数组
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      // 计算属性可以返回这么多的值，真是令我大开眼界了
      // 返回这四个属性 外面使用的时候直接 pager.pageCount pager.start ……
      return { pageCount, start, end, btnArr }
    })

    // 点击修改页码
    const changePage = (newPage) => {
      // myCurrentPage.value = newPage
      // 修改
      myCurrentPage.value = newPage
      // 通知父组件调接口
      emit('current-change', newPage)
      // if (myCurrentPage.value !== newPage) {
      //   myCurrentPage.value = newPage
      //   emit('current-change', newPage)
      // }
    }

    // 监听传值人的数据改变
    // 监听整个props的变化 里面有三个数据
    watch(props, () => {
      myTotal.value = props.total
      myCurrentPage.value = props.currentPage
      myPageSize.value = props.pageSize
    }, {
      immediate: true
    })
    return {
      pager,
      myCurrentPage,
      changePage
    }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
