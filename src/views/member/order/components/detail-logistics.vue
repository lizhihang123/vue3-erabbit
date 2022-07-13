<template>
  <div class="detail-logistics" v-if="logistics">
    <p>
      <span>{{ logistics[0].time }}</span>
      <span>{{ logistics[0].text }}</span>
    </p>
    <a href="javascript:;" @click="onLogisticsOrder(order)">查看物流</a>
    <Teleport to="#model">
      <order-logistics ref="logisticsOrderCom" />
    </Teleport>
  </div>
</template>
<script>
import { logisticsOrder } from '@/api/order'
import { ref } from 'vue'
import { useLogisticsOrder } from '../index'
import OrderLogistics from './order-logistics.vue'
export default {
  name: 'DetailLogistics',
  components: {
    OrderLogistics
  },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    //   获取物流的信息
    const logistics = ref(null)
    // 没有发货的商品 不调用这个接口？
    logisticsOrder(props.order.id).then(data => {
      logistics.value = data.result.list
    })

    // 使用...useLogisticsOrder() 相当于粘贴了如下代码 到下面 拥有了logisticsOrderCom 和 onLogisticsOrder
    // 封装逻辑 查看物流
    // export const useLogisticsOrder = () => {
    //   const logisticsOrderCom = ref(null)
    //   const onLogisticsOrder = (onLogisticsOrder) => {
    //     logisticsOrderCom.value.open(onLogisticsOrder)
    //   }
    //   return {
    //     logisticsOrderCom,
    //     onLogisticsOrder
    //   }
    // }
    return {
      logistics,
      ...useLogisticsOrder()
    }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
