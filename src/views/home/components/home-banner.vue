<template>
  <div class="home-banner">
      <xtx-carousel auto-play :slider="slider"/>
  </div>
</template>

<script>
import { findBanner } from '@/api/home.js'
import { ref } from 'vue'
export default {
  name: 'homeBanner',
  setup() {
    const slider = ref([])
    findBanner().then(res => {
      slider.value = res.result
    })
    return { slider }
  }
}
</script>

<style lang="less" scoped>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
  .xtx-carousel {
    :deep .carousel-btn.prev {
    left: 270px;
    }
    :deep .carousel-indicator {
    padding-left: 250px;
    }
  }
}
</style>
