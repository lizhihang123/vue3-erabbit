<template>
  <div class="xtx-cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120" >
                  <XtxCheckbox
                    @change="checkedAll"
                    :modelValue="$store.getters['cart/isCheckedAll']">
                    全选
                  </XtxCheckbox>
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <!-- 有效商品的数量为0时 -->
            <tr v-if="$store.getters['cart/validList'].length === 0">
              <td colspan="6">
                <cartNone />
              </td>
            </tr>
            <tr v-else v-for="validGood in $store.getters['cart/validList']" :key="validGood.skuId">
              <td>
                  <XtxCheckbox
                  :modelValue="validGood.selected"
                  @change="$event => checkedOne(validGood.skuId, $event)"
                   />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${validGood.id}`"><img :src="validGood.picture" alt=""></RouterLink>
                  <div>
                    <p class="name ellipsis">{{validGood.name}}</p>
                    <!-- 选择规格组件 -->
                    <cartSku
                    @change="$event => updateCartSku(validGood.skuId, $event)" :attrs-text="validGood.attrsText"
                    :skuId="validGood.skuId"
                    v-model="name"
                    />
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{validGood.nowPrice}}</p>
                <!-- price - 点击加入到购物车时的价格 -->
                <!-- nowPrice - 当前的最新的价格 -->
                <p v-if="validGood.price - validGood.nowPrice > 0">比加入时降价 <span class="red">&yen;{{validGood.price - validGood.nowPrice}}</span></p>
              </td>
              <td class="tc">
                <XtxNumber @change="$event => changeCount(validGood.skuId, $event)" :max="validGood.stock" :modelValue="validGood.count"  />
              </td>
              <td class="tc"><p class="f16 red">&yen;
                  {{Math.round(validGood.nowPrice * 100) *  validGood.count / 100}}
                  </p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p><a class="green" href="javascript:;" @click="deleteCart(validGood.skuId)">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody>
            <tr><td colspan="6"><h3 class="tit">失效商品</h3></td></tr>
            <tr v-for="invalidGood in $store.getters['cart/invalidList']" :key="invalidGood.skuId">
              <td><XtxCheckbox style="color:#eee;" :modelValue="invalidGood.selected" /></td>
              <td>
                <div class="goods">
                  <RouterLink to="/"><img :src="invalidGood.picture" alt=""></RouterLink>
                  <div>
                    <p class="name ellipsis">{{invalidGood.name}}</p>
                    <p class="attr">颜色：粉色 尺寸：14cm 产地：中国</p>
                  </div>
                </div>
              </td>
              <td class="tc"><p>&yen;{{invalidGood.nowPrice}}</p></td>
              <td class="tc">{{invalidGood.count}}</td>
              <td class="tc">
                  <p>&yen;
                    {{ Math.round(invalidGood.nowPrice * 100) * invalidGood.count / 100}}
                  </p>
             </td>
              <td class="tc">
                <p><a class="green" href="javascript:;">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheckbox :modelValue="$store.getters['cart/isCheckAll']" @change="checkedAll">全选</XtxCheckbox>
          <a href="javascript:;" @click="batchDeleteCart">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;" @click="batchDeleteCart(true)">清空失效商品</a>
        </div>
        <div class="total">
          共 {{$store.getters['cart/validTotal']}} 件商品，已选择 {{$store.getters['cart/selectedAmount']}} 件，商品合计:
          <span class="red">¥ {{$store.getters['cart/selectedPrice']}} </span>
          <XtxButton type="primary" @click="goCheckout">下单结算</XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>
<script>
import GoodRelevant from '@/views/goods/component/goods-relevant'
import Message from '@/components/library/Message'
import Confirm from '@/components/library/Confirm'
import cartNone from './components/cart-none.vue'
import cartSku from './components/cart-sku.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'XtxCartPage',
  components: { GoodRelevant, cartNone, cartSku },
  setup() {
    const store = useStore()
    // 单选
    const checkedOne = (skuId, selected) => {
      store.dispatch('cart/updateCart', {
        skuId,
        selected
      })
    }
    // 全选
    const checkedAll = (selected) => {
      store.dispatch('cart/checkAllCart', selected)
    }
    // 删除
    const deleteCart = (skuId) => {
      Confirm({ text: '确认删除该商品吗？' }).then(() => {
        store.dispatch('cart/deleteCart', skuId).then(() => {
          Message({
            type: 'success',
            text: '删除成功'
          })
        })
      }).catch(() => {
        Message({
          type: 'error',
          text: '取消删除'
        })
      })
    }
    // 批量删除
    const batchDeleteCart = (isClear) => {
      Confirm({
        text: `确认删除${isClear ? '失效' : '选中'}的所有商品吗？`
      }).then(() => {
        store.dispatch('cart/batchDeleteCart', isClear)
        Message({
          type: 'success',
          text: '删除成功'
        })
      })
    }
    // 修改本地商品的数量
    const changeCount = (skuId, count) => {
      store.dispatch('cart/updateCart', {
        skuId,
        count
      })
    }
    // 修改规格组件
    const updateCartSku = (oldSkuId, newSku) => {
      store.dispatch('cart/updateCartSku', {
        oldSkuId,
        newSku
      })
    }
    // 跳转结算页面
    const router = useRouter()
    const goCheckout = () => {
      // 1. 判断是否选择有效商品
      if (store.getters['cart/selectedAmount'] === 0) {
        return Message({
          text: '至少选中一件商品才能结算'
        })
      }
      // 2. 判断是否已经登录 未登录 弹窗提示
      if (!store.state.user.profile.token) {
        Confirm({
          text: '登录后才能结算, 是否进入登录页面'
        }).then(() => {
          router.push('/member/checkout')
        }).catch(e => {
        })
      } else {
        router.push('/member/checkout')
      }

      // 3. 进行跳转
    }
    return {
      checkedOne,
      checkedAll,
      deleteCart,
      batchDeleteCart,
      changeCount,
      updateCartSku,
      goCheckout
    }
  }
}
</script>
<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,td{
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
