<template>
  <div class="xtx-checkbox" @click="changeChecked()">
    <i v-if="checked"  class="iconfont icon-checked"></i>
    <i v-else  class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
// import { ref, watch } from 'vue'
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: [Boolean, Number],
      default: false
    }
  },
  setup (props, { emit }) {
    // 1. 成功 vueuse/core 直接实现父传子和子传父
    // 1.1 使用props接受了父传子modelValue
    // 1.2 使用useVModel包裹父传子变量 变成了响应式数据
    // 1.3 使用checked.value 就是使用父传子变量
    // 1.4 给checked.value赋值 就是子传父

    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      // 写法1：
      // checked.value = !checked.value
      // 写法2：
      const newVal = !checked.value
      checked.value = newVal

      emit('change', newVal)
    }

    // 2. 失败1 手写的方式实现v-model双向绑定
    // :modelValue
    // update:modelValue

    // // 点击事件，改变选中状态 写法3
    // const checked = ref(false)
    // const changeChecked = () => {
    //   checked.value = !checked.value
    //   emit('update: modelValue', checked.value)
    // }
    // watch(() => props.modelValue, () => {
    //   checked.value = props.modelValue
    // }, {
    //   immediate: true
    // })

    // 点击事件，改变选中状态 写法3
    // const checked = ref(false)
    // const { modelValue } = toRefs(props)
    // const changeChecked = () => {
    //   // 因为props.modelValue 一直是false所以这里是checked.value就不会发生变化
    //   // 因为checked.value不会发生变化 所以传递给父亲的值也不会发生变化
    //   const newVal = !modelValue.value
    //   checked.value = !newVal
    //   emit('update: modelValue', checked.value)
    // }
    // watch(() => props.modelValue, () => {
    //   checked.value = props.modelValue
    // }, {
    //   immediate: true
    // })

    // 写法4：成功 ref(props.modelValue) 是关键
    // const checked = ref(props.modelValue)
    // const changeChecked = () => {
    //   const newVal = !checked.value
    //   checked.value = newVal
    //   // console.log(checked.value) // 打印有true  有false
    //   // console.log(props.modelValue) // 打印一直是false 这个是false 不管 checked.value变化就ok了
    //   emit('update: modelValue', newVal)
    // }
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
