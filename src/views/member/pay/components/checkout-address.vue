<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i/>货<i/>人：</span>{{showAddress.receiver}}</li>
        <li><span>联系方式：</span>{{showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')}}</li>
        <li><span>收货地址： </span>{{showAddress.fullLocation.replace(/ /g, '')}}</li>
      </ul>
      <a v-if="showAddress" href="javascript:;" @click="openAddressEdit(showAddress)">修改地址</a>
    </div>
    <div class="action">
      <XtxButton @click="openDialog" class="btn">切换地址</XtxButton>
      <XtxButton class="btn" @click="openAddressEdit({})">添加地址</XtxButton>
    </div>
  </div>
  <!-- 切换收获地址的弹框 -->
  <XtxDialog title="切换收获地址" v-model:visible="dialogVisible"
  :widthSet="500"
  :heightSet="400"
  :bodyHeight="300"
  >
      <div
      v-for="item in list" :key="item.id"
      :class="{active: selectedAddress && item.id === selectedAddress.id}"
      @click="chooseAddress(item)"
      class="text item">
          <ul>
              <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
              <li><span>联系方式：</span>{{item.contact.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</li>
              <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
              <li class="close">
                  <a @click="deleteAddress(item)" href="JavaScript:;" class="iconfont icon-close-new">
                  </a>
              </li>
          </ul>
      </div>
      <template v-slot:footer>
            <XtxButton size="mini" type="gray" @click="dialogVisible = false">取消</XtxButton>
            <XtxButton size="mini" type="primary" @click="confirmAddress" style="margin-left: 10px">确认</XtxButton>
      </template>
  </XtxDialog>

  <!--  添加收获地址的弹框 -->
  <address-edit ref="addressEdit" @on-success="successHandler" />
</template>
<script>
import { ref, watch } from 'vue'
import xtxDialog from '@/components/library/xtx-dialog.vue'
import XtxButton from '@/components/library/xtx-button'
import AddressEdit from './address-edit'
import { deleteAddressApi } from '@/api/order'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
export default {
  components: { xtxDialog, XtxButton, AddressEdit },
  name: 'CheckoutAddress',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  emits: ['change', 'deleteAddress'],
  setup(props, { emit }) {
    // 是否有收获地址
    const showAddress = ref(null)
    // 有地址信息
    if (props.list.length) {
      const defaultAddress = props.list.find(item => item.isDefault === 0)
      // 如果有默认地址
      if (defaultAddress) {
        showAddress.value = defaultAddress
      } else {
        // 如果没有默认地址 地址的第一个信息取过来当作默认
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.list[0]
      }
    }
    // 弹框显示
    const dialogVisible = ref(false)
    // 组件初始化 默认地址id给checkout.vue组件
    emit('change', showAddress.value && showAddress.value.id)
    // 打开对话框
    const selectedAddress = ref(null)

    // 打开弹框
    const openDialog = () => {
      // 显示
      dialogVisible.value = true
      // 显示状态位空
      selectedAddress.value = null
    }
    // 确认地址
    const confirmAddress = () => {
      // 关闭弹框
      dialogVisible.value = false
      // 修改当前组件的默认展示地址
      showAddress.value = selectedAddress.value
      // 默认通知一个地址ID给父组件
      // showAddress.value?.id 相当于 showAddress.value && showAddress.value.id
      emit('change', showAddress.value?.id)
    }

    // 选择收获地址
    const chooseAddress = (item) => {
      // 选中的地址改为 当前点击的
      selectedAddress.value = item
    }

    const addressEdit = ref(null)
    // 打开 添加收获地址的弹框
    const openAddressEdit = (form) => {
      // 传入一个空对象 使得清空
      addressEdit.value.open(form)
    }

    // 添加+修改地址的成功方法
    const successHandler = (formData) => {
      // 区分是添加还是修改
      const editAddress = props.list.find(item => item.id === formData.id)
      if (editAddress) {
        for (const key in editAddress) {
          editAddress[key] = formData[key]
        }
      } else {
        const json = JSON.parse(JSON.stringify(formData))
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(json)
        // 如果要求为默认地址
        if (formData.isDefaultSec) {
          const arr = props.list.find(item => item.id === formData.id)
          showAddress.value = arr
        }
      }
    }

    // 删除收获地址
    const deleteAddress = (address) => {
      console.log(address)
      Confirm({
        text: '确认删除该地址吗？'
      }).then(async () => {
        await deleteAddressApi(address.id)
        // 提示
        Message({
          type: 'success',
          text: '删除该地址成功'
        })
        // 关闭弹框
        dialogVisible.value = false
        // 修改1
        // // 拷贝
        const json = JSON.parse(JSON.stringify(props.list))
        // 找到索引
        const index = json.findIndex(item => item.id === address.id)
        // 传值给父组件
        json.splice(index, 1)
        //
        emit('deleteAddress', json)

        // // 强行修改
        // const index = props.list.findIndex(item => item.id === address.id)
        // // eslint-disable-next-line vue/no-mutating-props
        // props.list.splice(index, 1)

        // 1. 判断当前默认的地址是不是删除的地址 根据id
        // 2. 如果是，替换当前showAddress 为 prop.list[0] 为第一个list
        // 3. 出错点 showAddress.value = props.list 出错 是因为 props.list此时也还没来得及更新呢 json是上面拷贝 + 删除后的数据 是更新后了的
        if (showAddress.value && address.id === showAddress.value.id) {
          showAddress.value = json[0] || null
        }
      })
    }

    // 监听 showAddress的值是否变化
    watch(() => showAddress, (newVal) => {
      emit('change', newVal.value ? newVal.value.id : null)
    }, {
      deep: true
    })

    return {
      showAddress,
      dialogVisible,
      openDialog,
      selectedAddress,
      confirmAddress,
      chooseAddress,
      addressEdit,
      openAddressEdit,
      successHandler,
      deleteAddress
    }
  }
}
</script>
<style scoped lang="less">
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.xtx-dialog {
  .text {
    position: relative;
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
        a {
          position: absolute;
          right: 5px;
          top: 40px;
        }
      }
    }
  }
}
</style>
