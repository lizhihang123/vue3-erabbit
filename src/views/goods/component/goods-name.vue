<template>
  <p class="g-name">{{goods.name}}</p>
  <p class="g-desc">{{goods.desc}}</p>
  <p class="g-price">
    <span>{{goods.price}}</span>
    <span>{{goods.oldPrice}}</span>
  </p>
  <div class="g-service">
    <dl>
      <dt>促销</dt>
      <dd>12月好物放送，App领券购买直降120元</dd>
    </dl>
    <dl>
      <dt>配送</dt>
      <dd>至 </dd>
      <dd>
          <XtxCity :fullLocation="fullLocation" @change="changeCity"/>
      </dd>
    </dl>
    <dl>
      <dt>服务</dt>
      <dd>
        <span>无忧退货</span>
        <span>快速退款</span>
        <span>免费包邮</span>
        <a href="javascript:;">了解详情</a>
      </dd>
    </dl>
  </div>
</template>

<script>
import XtxCity from '@/components/library/xtx-city.vue'
import { ref } from 'vue'
export default {
  name: 'GoodName',
  props: {
    goods: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    XtxCity
  },
  setup(props) {
    // 默认情况

    /**
     * 定义这几个变量 后续要存给后端
     */
    // 省码
    const provinceCode = ref('110000')
    // 市码
    const cityCode = ref('119900')
    // 县码
    const countyCode = ref('110101')
    // 完整地址
    const fullLocation = ref('北京市 市辖区 东城区')

    // 如果有默认地址
    /* 假如登录了，后端返回的goods的数据里面有userAddresses字段 */
    if (props.goods.userAddresses) {
      const defaultAddress = props.goods.userAddresses.find(address => address.isDefault === 1)
      if (defaultAddress) {
        provinceCode.value = defaultAddress.provinceCode
        cityCode.value = defaultAddress.cityCode
        countyCode.value = defaultAddress.countyCode
        fullLocation.value = defaultAddress.fullLocation
      }
    }
    // 子传父 点击了市区的操作
    const changeCity = (result) => {
      provinceCode.value = result.provinceCode
      cityCode.value = result.provinceCode
      countyCode.value = result.provinceCode
      fullLocation.value = result.fullLocation
    }
    return {
      fullLocation,
      changeCity
    }
  }
}
</script>

<style lang="less" scoped>
.g-name {
  font-size: 22px
}
.g-desc {
  color: #999;
  margin-top: 10px;
}
.g-price {
  margin-top: 10px;
  span {
    &::before {
      content: "¥";
      font-size: 14px;
    }
    &:first-child {
      color: @priceColor;
      margin-right: 10px;
      font-size: 22px;
    }
    &:last-child {
      color: #999;
      text-decoration: line-through;
      font-size: 16px;
    }
  }
}
.g-service {
  background: #f5f5f5;
  width: 500px;
  padding: 20px 10px 0 10px;
  margin-top: 10px;
  dl {
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      color: #666;
      &:last-child {
        span {
          margin-right: 10px;
          &::before {
            content: "•";
            color: @xtxColor;
            margin-right: 2px;
          }
        }
        a {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
