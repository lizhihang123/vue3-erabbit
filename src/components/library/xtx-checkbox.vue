<template>
  <div class="xtx-checkbox" @click="changeChecked">
    <i v-if="checked"  class="iconfont icon-checked"></i>
    <i v-else  class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default()"><slot />{{checked}}</span>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
// import { ref, watch } from 'vue'
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: true
    }
  },
  setup (props, { emit }) {
    // 1. vueuse/core
    // 1.1 使用props接受了父传子modelValue
    // 1.2 使用useVModel包裹父传子变量 变成了响应式数据
    // 1.3 使用checked.value 就是使用父传子变量
    // 1.4 给checked.value赋值 就是子传父
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      checked.value = !checked.value
      emit('change', checked.value)
    }
    // 2. 手写的方式实现v-model双向绑定
    // :modelValue
    // update:modelValue

    // const checked = ref(false)
    // // 点击事件，改变选中状态
    // const changeChecked = () => {
    //   checked.value = !checked.value
    //   emit('update: modelValue', checked.value)
    // }
    // // 父组件一传值过来 就给checked赋值
    // watch(() => props.modelValue, () => {
    //   checked.value = props.modelValue
    // }, {
    //   immediate: true
    // })
    return {
      changeChecked,
      checked
    }
  }
}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
