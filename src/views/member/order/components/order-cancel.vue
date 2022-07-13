<template>
  <XtxDialog title="取消订单" v-model:visible="visibleDialog">
    <!-- 组件内容 -->
    <div class="cancel-info">
      <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
      <p class="tip">请选择取消订单的原因（必选）：</p>
      <div class="btn">
        <a
          @click="curText = item"
          v-for="item in cancelReason"
          :key="item"
          href="javascript:;"
          :class="{ active: curText === item }"
        >
          {{ item }}
        </a>
      </div>
    </div>
    <!-- 按钮操作 -->
    <template #footer>
      <XtxButton
        type="gray"
        @click="visibleDialog = false"
        style="margin-right: 20px"
        >取消</XtxButton
      >
      <XtxButton type="primary" @click="submit">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { ref } from 'vue'
import { cancelReason } from '@/api/constant'
import Message from '@/components/library/Message'
import { cancelOrder } from '@/api/order'
export default {
  name: 'OrderCancel',
  setup() {
    // 弹框显示隐藏
    const visibleDialog = ref(false)
    // 当前选中的"取消订单"的原因
    const curText = ref(null)
    // 打开对话框 提供给其它组件使用
    const order = ref(null)
    const open = (item) => {
      visibleDialog.value = true
      order.value = item
      // 清除之前选的curText
      curText.value = ''
    }

    // 确认订单的方法
    const submit = () => {
      if (!curText.value) {
        return Message({
          text: '请选择取消订单的原因',
          type: 'warn'
        })
      }
      cancelOrder(order.value.id, curText.value).then(data => {
        // 取消订单成功
        Message({
          text: '取消订单成功',
          type: 'success'
        })
        // 更新订单状态
        order.value.orderState = 6
        // 关闭对话框
        visibleDialog.value = false
      })
    }
    return {
      visibleDialog,
      cancelReason,
      curText,
      submit,
      order,
      open
    }
  }
}

</script>
<style scoped lang="less">
.xtx-dialog :deep(.wrapper) {
  width: 620px;
}
.cancel-info {
  p {
    font-size: 16px;
    line-height: 35px;
    &.tip {
      color: #999;
    }
  }
  .btn {
    padding-top: 21px;
    display: flex;
    flex-wrap: wrap;
    a {
      width: 256px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 20px;
      color: #666;
      &:nth-child(2n) {
        margin-right: 0;
      }
      &:hover,
      &.active {
        background-color: #e3f9f4;
        border-color: @xtxColor;
      }
    }
  }
}
</style>
