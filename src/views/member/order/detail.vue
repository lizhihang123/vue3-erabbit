<template>
  <div class="order-detail-page" v-if="order">
    <!-- 操作栏 -->
    <DetailAction
    :order="order" />
    <!-- 步骤条 组件xtx-steps.vue-->
    <DetailSteps :order="order" />
    <!-- 物流栏 -->
    <Suspense>
      <template #default>
        <DetailLogistics
          v-if="[3, 4, 5].includes(order.orderState)"
          :order="order"
        />
      </template>
      <template #fallback>
        <div class="loading">loading...</div>
      </template>
    </Suspense>
    <!-- 订单商品信息 -->
    <order-info :order="order" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { findOrder } from '@/api/order'
import DetailAction from '@/views/member/order/components/detail-action.vue'
import DetailSteps from '@/views/member/order/components/detail-steps.vue'
import DetailLogistics from '@/views/member/order/components/detail-logistics.vue'
import OrderInfo from '@/views/member/order/components/order-info.vue'

export default {
  name: 'Detail',
  components: {
    DetailAction,
    DetailSteps,
    DetailLogistics,
    OrderInfo
  },
  props: {
    active: {
      type: Number,
      default: 1
    }
  },
  setup() {
    // 1. 处理好订单的数据 - 响应页面
    // 2. 路由能够跳转
    // 3. 按钮能够分类处理
    // 获取订单详情
    const order = ref(null)
    const route = useRoute()
    findOrder(route.params.id).then((data) => {
      order.value = data.result
    })
    return {
      order
    }
  }
}
</script>

<style scoped lang='less'>
.order-detail-page {
  background: #fff;
  height: 100%;
}
.loading {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
</style>
