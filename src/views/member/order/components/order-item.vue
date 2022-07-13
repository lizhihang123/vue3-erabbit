<template>
  <div class="order-item" v-if="item">
    <div class="head">
      <span>下单时间：{{ item.createTime }}</span>
      <span>订单编号：{{ item.id }}</span>
      <span class="down-time" v-if="item.orderState === 1">
        <i class="iconfont icon-down-time"></i>
        <b>付款截止：{{ timeText }}</b>
      </span>
      <!-- 删除？ -->
      <a
      @click="$emit('on-delete', item)"
      v-if="[5, 6].includes(item.orderState)" href="javascript:;" class="del"
        >删除</a
      >
    </div>
    <div class="body">
      <div class="column goods">
        <ul>
          <li v-for="good in item.skus" :key="good.id">
            <RouterLink class="image" :to="`/product/${good.spuId}`">
              <img :src="good.image" alt="" />
            </RouterLink>
            <div class="info">
              <p class="name ellipsis-2">{{ good.name }}</p>
              <p class="attr ellipsis">
                <span>{{ good.attrsText }}</span>
                <!-- <span>尺寸：10寸</span> -->
              </p>
            </div>
            <div class="price">¥{{ good.realPay }}</div>
            <div class="count">x{{ good.quantity }}</div>
          </li>
        </ul>
      </div>
      <div class="column state">
        <!-- 待收货  查看物流 -->
        <!-- 待评价  评价商品 -->
        <!-- 已完成  查看评价 -->
        <!-- 其他情况 不显示 这个按钮 -->
        <p>{{ orderStatus[item.orderState].label }}</p>
        <p v-if="item.orderState === 3">
          <a class="green" href="javascript:;" @click="$emit('on-logistic', item)">查看物流</a>
        </p>
        <p v-if="item.orderState === 4">
          <a class="green" href="javascript:;">评价商品</a>
        </p>
        <p v-if="item.orderState === 5">
          <a class="green" href="javascript:;">查看评价</a>
        </p>
      </div>
      <div class="column amount">
        <p class="red">¥{{ item.payMoney }}</p>
        <p>（含运费：¥{{ item.postFee }}）</p>
        <p>在线支付</p>
      </div>
      <div class="column action">
        <!-- 待支付：立即付款，查看详情，取消订单 -->
        <!-- 待发货：查看详情，再次购买 -->
        <!-- 待收货：确认收货，查看详情，再次购买 -->
        <!-- 待评价：查看详情，再次购买，申请售后 -->
        <!-- 已完成：查看详情，再次购买，申请售后 -->
        <!-- 已取消：查看详情 -->
        <!--  * orderState 订单状态，
            1为待付款、
            2为待发货、
            3为待收货、
            4为待评价、
            5为已完成、
            6为已取消，
            未传该参数或0为全部 -->
        <XtxButton @click="$router.push(`/member/pay?orderId=${item.id}`)" v-if="item.orderState === 1" type="primary" size="small"
          >立即付款</XtxButton
        >
        <XtxButton
        @click="$emit('on-confirm', item)"
        v-if="item.orderState === 3" type="primary" size="small"
          >确认收货</XtxButton
        >
        <p><RouterLink  :to="`/member/order/${item.id}`">查看详情</RouterLink></p>
        <p
        v-if="item.orderState === 1">
          <a
          href="javascript:;"
          @click="cancelOrder(item)"
          >取消订单</a>
        </p>
        <p v-if="[2, 3, 4, 5].includes(item.orderState)">
          <a href="javascript:;">再次购买</a>
        </p>
        <p v-if="[4, 5].includes(item.orderState)">
          <a href="javascript:;">申请售后</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { usePayTime } from '@/hooks'
import { orderStatus } from '@/api/constant'
export default {
  name: 'orderItem',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    // 倒计时如何使用
    const { start, timeText } = usePayTime()
    start(props.item.countdown)
    // 取消订单
    const cancelOrder = (item) => {
      console.log(item)
      emit('on-cancel', item)
    }
    return {
      timeText,
      orderStatus,
      cancelOrder
    }
  }
}
</script>

<style scoped lang='less'>
.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;
  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;
    span {
      margin-right: 20px;
      &.down-time {
        margin-right: 0;
        float: right;
        i {
          vertical-align: middle;
          margin-right: 3px;
        }
        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }
    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }
  .body {
    display: flex;
    align-items: stretch;
    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;
      > p {
        padding-top: 10px;
      }
      &:first-child {
        border-left: none;
      }
      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;
        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;
            &:last-child {
              border-bottom: none;
            }
            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }
            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;
              p {
                margin-bottom: 5px;
                &.name {
                  height: 38px;
                }
                &.attr {
                  color: #999;
                  font-size: 12px;
                  span {
                    margin-right: 5px;
                  }
                }
              }
            }
            .price {
              width: 100px;
            }
            .count {
              width: 80px;
            }
          }
        }
      }
      &.state {
        width: 120px;
        .green {
          color: @xtxColor;
        }
      }
      &.amount {
        width: 200px;
        .red {
          color: @priceColor;
        }
      }
      &.action {
        width: 140px;
        a {
          display: block;
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>
