<template>
  <div class="xtx-dialog" :class="{fade: fade}" v-show="visible" >
    <div class="wrapper" :class="{fade: fade}" :style="{width: widthSet + 'px',height: heightSet + 'px'}">
      <div class="header">
        <h3>{{ title }}</h3>
        <a @click="close" href="JavaScript:;" class="iconfont icon-close-new"></a>
      </div>
      <div class="body" :style="{height: bodyHeight + 'px'}">
        <slot />
      </div>
      <div class="footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch } from 'vue'
export default {
  name: 'XtxDialog',
  components: {
  },
  props: {
    title: {
      type: String,
      default: '温馨提示'
    },
    visible: {
      type: Boolean,
      default: false
    },
    widthSet: {
      type: Number,
      default: 800
    },
    heightSet: {
      type: Number,
      default: 600
    },
    bodyHeight: {
      type: Number,
      default: 400
    }
  },
  setup(props, { emit }) {
    const fade = ref(false)
    // onMounted(() => {
    //   setTimeout(() => {
    //     fade.value = true
    //   }, 0)
    //   // fade.value = true
    // })
    // 改造动画的执行时机
    watch(() => props.visible, () => {
      setTimeout(() => {
        fade.value = props.visible
      }, 0)
    }, {
      immediate: true
    })
    // 关闭的时候通知父组件
    const close = () => {
      emit('update:visible', false)
    }
    return {
      fade,
      close
    }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  background: rgba(0,0,0);
  &.fade {
    transition: all .4s;
    background: rgba(0,0,0,.5);
  }
  .wrapper {
    width: 400px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: 25px;
    transform: translate(-50%,-50%);
    &.fade {
      transition: all 0.4s;
      transform: translate(-50%,-55%);
      opacity: 1;
    }
    .header,.footer {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    .body {
      padding: 20px 40px;
      font-size: 16px;
      overflow-y: auto;
      .icon-warning {
        color: @priceColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }
    .footer {
      text-align: right;
      .xtx-button {
        margin-left: 20px;
      }
    }
    .header {
      position: relative;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>
