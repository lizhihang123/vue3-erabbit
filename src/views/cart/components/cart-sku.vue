<template>
  <div class="cart-sku" ref="target">
    <div class="layer" v-if="visible">
      <!-- 这里使用loading 还是 !goods都ok -->
      <div v-if="loading" class="loading"></div>
      <GoodsSku v-if="goods" @change="changeSku" :goods="goods" :skuId="skuId" />
      <XtxButton v-if="goods" size="mini" type="primary" style="margin-left: 60px" @click="submit">
          确认
      </XtxButton>
    </div>
    <div class="attrs" @click="toggle">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import GoodsSku from '@/views/goods/component/goods-sku.vue'
import { getSpecsAndSkus } from '@/api/cart'
import { onClickOutside } from '@vueuse/core'
export default {
  name: 'CartSku',
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  components: {
    GoodsSku
  },
  setup(props, { emit }) {
    const goods = ref(null)
    const visible = ref(false)
    const loading = ref(false)
    // 显示
    const show = () => {
      visible.value = true
      loading.value = true
      // 根据skuId数据 获取当前的spec和sku数据
      getSpecsAndSkus(props.skuId).then(res => {
        console.log(goods)
        goods.value = res.result
        loading.value = false
      })
    }
    // 隐藏
    const hide = () => {
      visible.value = false
      goods.value = null
    }
    // 切换
    const toggle = () => {
    //   visible.value ?  hide() : show()
      if (visible.value) {
        hide()
      } else {
        show()
      }
    }
    const target = ref(null)
    // 点击外面，隐藏表单
    onClickOutside(target, () => {
      hide()
    })

    // 记录选择的sku值 - 来自goods-sku组件传递出来的值
    const currSku = ref(null)
    const changeSku = (sku) => {
      currSku.value = sku
    }
    // 点击确认的时候传出sku的信息
    const submit = () => {
      // currSku有值 有skuId值 且 skuId值不等于传递进来的skuId -> 排除 没有选择规格 以及 skuId前后没有发生改变的情况
      if (currSku.value && currSku.value.skuId && currSku.value.skuId !== props.skuId) {
        // 技巧 - currSku.value
        emit('change', currSku.value)
        // 点击确定 隐藏cart-sku组件
        hide()
      }
    }
    return {
      show,
      hide,
      goods,
      visible,
      toggle,
      submit,
      changeSku,
      target,
      loading
    }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display:inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor,50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(.8,1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
