<template>
  <div class="goods-detail">详情
    <!-- 属性 -->
    <ul class="attrs">
      <li v-for="item in goods.details.properties" :key="item.value">
        <span class="dt">{{item.name}}</span>
        <span class="dd">{{item.value}}</span>
      </li>
    </ul>
    <!-- 图片 -->
    <img v-for="item in goods.details.pictures" :key="item" :src="item" alt="">
  </div>
</template>
<script>
import { inject } from 'vue'
export default {
  name: 'GoodsDetail',
  setup() {
    const goods = inject('goods')
    return {
      goods
    }
  }
}
</script>
<style scoped lang="less"></style>
