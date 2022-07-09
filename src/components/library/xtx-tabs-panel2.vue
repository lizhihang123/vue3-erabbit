<template>
  <!-- 装载的是内容 -->
  <div class='"xtx-tabs-panel' v-show="activeName === name">
      <slot />
  </div>
</template>

<script>
import { inject } from 'vue'
export default {
  name: '"xtx-tabs-panel',
  props: {
    // 标签页标题文章
    label: {
      type: String,
      default: ''
    },
    // 唯一的标识
    name: {
      type: String,
      default: ''
    }
  },
  setup() {
    // 当前组件该不该显示 取决于xtx-tabs组件里面的activeName值和props.name值是否是一样的
    const activeName = inject('activeName')
    return {
      activeName
    }
  }
}
</script>

<style scoped lang='less'>

</style>
