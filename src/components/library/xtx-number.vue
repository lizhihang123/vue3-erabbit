<template>
  <div class="xtx-numbox">
    <!-- 不一定有label这个组件 -->
    <div class="label" v-if="label">{{label}}</div>
    <div class="numbox">
      <a href="javascript:;" @click="changeNum(-1)">-</a>
      <input type="text" readonly :value="modelValue">
      <a href="javascript:;" @click="changeNum(1)">+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxNumber',
  props: {
    label: {
      type: String
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 100
    },
    modelValue: {
      type: Number,
      default: 1
    }
  },
  setup(props, { emit }) {
    // 使用vueuse的父传子 子改父
    // 相当于num.value = props.modelValue
    // 以及emit('update:modelValue', num)
    const num = useVModel(props, 'modelValue', emit)
    // 点击按钮 修改值
    const changeNum = (value) => {
      // 中转值
      const newValue = num.value + value
      // 判断是否越界 小于0 或者是 大于库存 return
      if (newValue > props.max || newValue < props.min) return
      num.value = newValue
      // 一般还会有额外的change事件 不同于修改值的update事件
      emit('change', num)
    }

    return {
      num,
      changeNum
    }
  }
}
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right:1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left:1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
