<template>
  <div class="detail-action">
    <div class="state">
      <!-- 这样写 直接添加这个类名 -->
      <span
        class="iconfont"
        :class="[`icon-order-${orderStatus[order.orderState].name}`]"
      ></span>
      <p>{{ orderStatus[order.orderState].label }}</p>
    </div>
    <div class="info">
      <p>订单编号：{{ order.id }}</p>
      <p>下单时间：{{ order.createTime }}</p>
    </div>
    <div class="btn">
      <!-- 待付款 -->
      <template v-if="order.orderState === 1">
        <XtxButton
          size="small"
          type="primary"
          @click="fn"
          >立即付款</XtxButton
        >
        <XtxButton size="small" type="gray" @click="onCancelOrder(order)">取消订单</XtxButton>
      </template>
      <!-- 待发货 -->
      <template v-if="order.orderState === 2">
        <XtxButton
        size="small"
        type="primary"
        @click="$router.push(`/member/checkout?orderId=${order.id}`)"
        >再次购买</XtxButton>
      </template>
      <!-- 待收获 -->
      <template v-if="order.orderState === 3">
        <XtxButton
        size="small"
        type="primary"
        @click="onConfirmOrder(order)"
        >确认收货</XtxButton>
        <XtxButton size="small" type="plain"
        @click="$router.push(`/member/checkout?orderId=${order.id}`)"
        >再次购买</XtxButton>
      </template>

      <!-- 待评价  -->
      <template v-if="order.orderState === 4">
        <XtxButton size="small" type="primary"
        @click="$router.push(`/member/checkout?orderId=${order.id}`)"
        >再次购买</XtxButton>
        <XtxButton size="small" type="plain">评价商品</XtxButton>
        <XtxButton size="small" type="gray">申请售后</XtxButton>
      </template>
      <!-- 已完成 -->
      <template v-if="order.orderState === 5">
        <XtxButton size="small" type="primary"
        @click="$router.push(`/member/checkout?orderId=${order.id}`)"
        >再次购买</XtxButton>
        <XtxButton size="small" type="plain">查看评价</XtxButton>
        <XtxButton size="small" type="gray">申请售后</XtxButton>
      </template>
      <!-- 已取消 -->
    </div>

    <!-- 取消订单 -->
    <cancel-order ref="orderCancelCom"/>
  </div>
</template>
<script>
import { orderStatus } from '@/api/constant'
import { useCancelOrder, useConfirmOrder } from '../index'
import CancelOrder from './order-cancel.vue'
import { useRouter } from 'vue-router'
export default {
  name: 'OrderDetailAction',
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    CancelOrder
  },
  setup(props) {
    const router = useRouter()
    const fn = () => {
      console.log(1)
    }
    return {
      orderStatus,
      router,
      // 获得orderCancelCom变量和onCancelOrder方法
      // 封装逻辑 取消订单相当于 这段逻辑在这里
      // export const useCancelOrder = () => {
      //   const orderCancelCom = ref(null)
      //   const onCancelOrder = (item) => {
      //     orderCancelCom.value.open(item)
      //   }
      //   return {
      //     orderCancelCom,
      //     onCancelOrder
      //   }
      // }
      ...useCancelOrder(),
      ...useConfirmOrder(),
      fn
    }
  }
}
</script>
<style scoped lang="less">
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .xtx-button {
      margin-left: 20px;
    }
  }
}
</style>
