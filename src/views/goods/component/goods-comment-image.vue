<template>
  <div class="goods-comment-image">
    <div class="list">
      <a
        href="javascript:;"
        :class="{active: currentImage === url}"
        @click="currentImage = url"
        v-for="(url, index) in pictures"
        :key="index"
      >
        <img :src="url" alt="">
      </a>

      <!-- 预览的图片 -->
      <div class="preview" v-if="currentImage">
        <img :src="currentImage" alt="">
        <!-- 关闭按钮 点击 关闭预览图片 -->
        <i @click="currentImage = null" class="iconfont icon-close-new"></i>
      </div>
    </div>
    <!-- 图片预览 和 关闭图片 -->
  </div>
</template>
<script>
import { ref } from 'vue'
export default {
  name: 'GoodsCommentImage',
  props: {
    pictures: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    // 这里给null 而不是'' 因为如果没有选中 就没有预览的图片
    // 使得能够默认预览第一张图片
    const currentImage = ref(props.pictures[0])
    return {
      currentImage
    }
  }
}
</script>
<style scoped lang="less">
.goods-comment-image {
  .list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    a {
      width: 120px;
      height: 120px;
      border:1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      &.active {
        border-color: @xtxColor;
      }
    }
  }

  .preview {
    width: 480px;
    height: 480px;
    border: 1px solid #e4e4e4;
    background: #f8f8f8;
    margin-bottom: 20px;
    position: relative;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    i {
      position: absolute;
      right: 0;
      top: 0;
      width: 30px;
      height: 30px;
      background: rgba(0,0,0,0.2);
      color: #fff;
      text-align: center;
      line-height: 30px;
    }
  }
}
</style>
