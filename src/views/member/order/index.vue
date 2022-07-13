<template>
  <div class="member-order">
    <!-- tab切换栏 -->
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <XtxTabPanel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </XtxTabPanel>
    </XtxTabs>
    <div class="order-list">
      <!-- 加载中 -->
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <!-- 订单列表 -->
      <order-item
        v-for="order in orderList"
        :key="order.id"
        :item="order"
        @on-delete="deleteOrder"
        @on-cancel="onCancelOrder"
        @on-confirm="onConfirmOrder"
        @on-logistic="onLogisticsOrder"
      />
      <!-- 分页组件 -->
      <XtxPagination
        v-if="total > reqParams.pageSize"
        @current-change="changePage"
        :total="total"
        :page-size="reqParams.pageSize"
        :current-page="reqParams.page"
      />
    </div>
    <orderCancel ref="orderCancelCom" />
    <!-- 查看物流 -->
    <order-logistics ref="logisticsOrderCom" />
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import { orderStatus } from '@/api/constant'
import { findOrderList, deleteOrderApi, confirmOrderApi } from '@/api/order'
import orderItem from './components/order-item'
import orderCancel from './components/order-cancel'
import OrderLogistics from './components/order-logistics'
import Message from '@/components/library/Message'
import Confirm from '@/components/library/Confirm'
export default {
  name: 'memberOrder',
  components: {
    orderItem,
    orderCancel,
    OrderLogistics
  },
  emits: ['on-delete', 'on-cancel'],
  setup() {
    // 1. 请求订单 + tab切换订单
    // 2. 分页使用
    // 3. 加载中的loading效果
    // 获取查询订单参数
    // 4. 删除订单
    // 5. 获取订单详情
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    // 分页 - 总数
    const total = ref(0)
    // 点击修改页码
    const changePage = (newPage) => {
      reqParams.page = newPage
    }

    // 订单 - 列表
    const orderList = ref([])
    // 加载中
    const loading = ref(true)
    // 获取订单
    const getOrderList = () => {
      loading.value = true
      findOrderList(reqParams).then((data) => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }
    // tab激活
    const activeName = ref('all')
    // 点击事件
    const tabClick = (tab) => {
      // 再下面监听reqParams
      // 那么这里一定需要reqParams 发生变化
      reqParams.page = 1
      reqParams.orderState = tab.index
      // console.log(activeName.value) // 这里打印发生了变化
    }

    // 侦听请求参数 tabs切换调用接口 + 分页调用接口
    watch(
      () => reqParams,
      () => {
        getOrderList()
      },
      {
        immediate: true,
        deep: true
      }
    )

    // 删除订单
    const deleteOrder = (item) => {
      Confirm({
        text: '亲，您确认删除该订单吗'
      }).then(() => {
        deleteOrderApi([item.id]).then(() => {
          Message({
            type: 'success',
            text: '删除成功'
          })
          getOrderList()
        }).catch(() => {
          Message({
            type: 'error',
            text: '删除失败'
          })
        })
      }).catch(() => {
        Message({
          type: 'success',
          text: '删除成功'
        })
      })
    }

    return {
      activeName,
      orderStatus,
      reqParams,
      orderList,
      tabClick,
      loading,
      total,
      changePage,
      getOrderList,
      // 同时获得orderCancelCom
      // 同时获得onCancelOrder
      // 取消订单
      ...useCancelOrder(),
      deleteOrder,
      // 确认收货
      ...useConfirmOrder(),
      // 查看物流
      ...useLogisticsOrder()
    }
  }
}

// 封装逻辑 取消订单
export const useCancelOrder = () => {
  const orderCancelCom = ref(null)
  const onCancelOrder = (item) => {
    orderCancelCom.value.open(item)
  }
  return {
    orderCancelCom,
    onCancelOrder
  }
}

// 封装逻辑 确认收货
export const useConfirmOrder = () => {
  const onConfirmOrder = (item) => {
    // 确认收货嘛 ？
    Confirm({
      text: '您确认收到货吗？确认收到后货款就会打给卖家'
    }).then(() => {
      confirmOrderApi(item.id).then(() => {
        Message({
          type: 'success',
          text: '确认收货成功'
        })
        // 确认收货后状态改为 ‘待评价’
        // 这个数据是一个响应式数据 或者说修改这个对象的值 改的是内存空间的值
        item.orderState = 4
      })
    })
  }
  return {
    onConfirmOrder
  }
}

// 封装逻辑 查看物流
export const useLogisticsOrder = () => {
  const logisticsOrderCom = ref(null)
  const onLogisticsOrder = (onLogisticsOrder) => {
    logisticsOrderCom.value.open(onLogisticsOrder)
  }
  return {
    logisticsOrderCom,
    onLogisticsOrder
  }
}
</script>

<style scoped lang='less'>
.member-order {
  height: 100%;
  background: #fff;
  .order-list {
    position: relative;
    background: #fff;
    min-height: 400px;
    padding: 20px;
    .loading {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0px;
      background: rgba(255, 255, 255, 0.9)
        url(../../../assets/images/loading.gif) no-repeat center;
      z-index: 10;
    }
  }

  .none {
    height: 400px;
    text-align: center;
    line-height: 400px;
    color: #999;
  }
}
</style>
