<template>
  <div class='xtx-carousel'
  @mouseenter="stop()"
  @mouseleave="start()"
  >
    <ul class="carousel-body">
      <li class="carousel-item"
      v-for="(item, index) in slider"
      :key="index"
      :class="{fade: index === fade}"
      >
        <!-- 如果没有item.hrefUrl就是同类推荐  -->
        <RouterLink :to="item.hrefUrl" v-if="item.hrefUrl">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
        <div v-else class="slider">
          <!-- 注意这里的数据结构 一个item里面就有四个商品 [[4], [4], [4], [4]] -->
          <RouterLink v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
            <img :src="goods.picture" alt=""/>
            <p class="name ellipsis">{{goods.name}}</p>
            <!-- &yen; -》就是￥ -->
            <p class="price">&yen;{{goods.price}}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <a
    href="javascript:;"
    class="carousel-btn prev"
    @click="toggle(-1)"
    >
      <i class="iconfont icon-angle-left"></i>
    </a>
    <a
    href="javascript:;"
    class="carousel-btn next"
    @click="toggle(1)">
      <i class="iconfont icon-angle-right"></i>
    </a>
    <div class="carousel-indicator">
      <span
      v-for="(item, index) in slider"
      :key="index"
      :class="{active: fade === index}"
      @click="fade = index"
      ></span>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    slider: {
      type: Array,
      default: () => []
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 1000
    }
  },
  setup(props) {
    // fade变量控制默认显示的轮播图
    const fade = ref(0)
    // 1. 自动播放功能
    let timer = null
    const autoPlayFn = () => {
      // 1.1 一上来 清除定时器 防止重复开启
      clearInterval(timer)
      timer = setInterval(() => {
        fade.value++
        // 1.2 为什么这里要写props.slider.length 而不是直接slider.length
        if (fade.value >= props.slider.length) {
          fade.value = 0
        }
      }, props.duration)
    }
    // 1.3 注意侦听 有slider数据时 有自动播放的数据传入时，才开启自动播放
    watch(() => props.slider, (newVal) => {
      // newVal是监听到的改变的数据
      if (newVal.length && props.autoPlay) {
        // 默认显示第一张图片
        fade.value = 0
        autoPlayFn()
      }
    },
    {
      immediate: true
    }
    )

    // 2.鼠标进入，关闭自动播放；鼠标离开，开启自动播放
    const stop = () => {
      clearInterval(timer)
    }
    const start = () => {
      if (props.slider && props.slider.length && props.autoPlay) {
        if (fade.value >= props.slider.length) {
          fade.value = 0
        }
        if (fade.value < 0) {
          fade.value = props.slider.length - 1
        }
        autoPlayFn()
      }
    }
    // 4. 点击左右按钮 能够进行切换
    const toggle = (step) => {
      const newValue = fade.value + step
      if (newValue >= props.slider.length) {
        fade.value = 0
        return
      }
      if (newValue.value < 0) {
        fade.value = props.slider.length - 1
        return
      }
      fade.value = newValue
    }

    // 5. 销毁组件时 清除定时器
    onMounted(() => {
      clearInterval(timer)
    })
    return { fade, stop, start, toggle }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background:  #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}

// 轮播商品
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    img {
      padding: 20px;
      width: 230px!important;
      height: 230px!important;
    }
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
