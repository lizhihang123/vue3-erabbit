<template>
  <div class="goods-image">
    <!-- 大图 -->
    <div class="large" v-show="show" :style="[{backgroundImage:`url(${images[currIndex]})`}, {backgroundPosition: `${bgPosition.backgroundPositionX} ${bgPosition.backgroundPositionY}`}]"></div>
    <!-- 中图 -->
    <div class="middle" ref="target">
      <img :src="images[currIndex]" alt="">
      <!-- 遮罩容器 -->
      <div class="layer" v-show="show" :style="[{top: `${position.top}`}, {left: `${position.left}`}]"></div>
    </div>
    <!-- 小图 -->
    <ul class="small">
      <li v-for="(img, i) in images" :key="img" :class="{active: i === currIndex}">
        <img @mouseenter="currIndex = i" :src="img" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const currIndex = ref(0)
    const { position, bgPosition, target, show } = usePreviewImg()
    return {
      currIndex,
      usePreviewImg,
      position,
      bgPosition,
      show,
      target
    }
  }
}
const usePreviewImg = () => {
  // 被监听坐标的容器
  const target = ref(null)
  // 遮罩和大图的显示隐藏
  const show = ref(false)
  const { elementX, elementY, isOutside } = useMouseInElement(target)
  const position = reactive({
    top: 0,
    left: 0
  })
  // 大图的背景图片坐标
  const bgPosition = reactive({
    backgroundPositionX: 0,
    backgroundPositionY: 0
  })
  // watch同时监听多个变量
  // 第一个变量没有用 () => {} 因为三个变量都是响应式的?
  watch([elementX, elementY, isOutside], () => {
    // 控制X的位置在0-200之间
    if (elementX.value < 100) {
      position.left = 0
    } else if (elementX.value > 300) {
      position.left = 200
    } else {
      position.left = elementX.value - 100
    }
    // 控制Y的位置在0-200之间
    if (elementY.value < 100) {
      position.top = 0
    } else if (elementY.value > 300) {
      position.top = 200
    } else {
      position.top = elementY.value - 100
    }
    // 设置大背景的定位
    bgPosition.backgroundPositionX = -position.left * 2 + 'px'
    bgPosition.backgroundPositionY = -position.top * 2 + 'px'
    // 遮罩容器的定位
    position.left = position.left + 'px'
    position.top = position.top + 'px'
    // 遮罩容器是否显示
    show.value = !isOutside.value
  })
  return {
    position,
    bgPosition,
    show,
    target
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0,0,0,.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
