<template>
  <XtxDialog
  :title="formData.id ? '切换收获地址' : '修改收获地址'"
  v-model:visible="dialogVisible"
  :widthSet="800"
  :heightSet="600"
  :bodyHeight="490"
  >
    <div class="address-edit">
        <div class="xtx-form">
          <div class="xtx-form-item">
              <div class="label">收货人：</div>
              <div class="field">
              <input class="input" v-model="formData.receiver"
              placeholder="请输入收货人" />
              </div>
          </div>
          <div class="xtx-form-item">
              <div class="label">手机号：</div>
              <div class="field">
              <input class="input" v-model="formData.contact"
              placeholder="请输入手机号" />
              </div>
          </div>
          <div class="xtx-form-item">
              <div class="label">地区：</div>
              <div class="field">
              <XtxCity
              :fullLocation="formData.fullLocation"
              @change="changeCity"

              placeholder="请选择所在地区"/>
              </div>
          </div>
          <div class="xtx-form-item">
              <div class="label">详细地址：</div>
              <div class="field">
              <input class="input"
              v-model="formData.address"

              placeholder="请输入详细地址" />
              </div>
          </div>
          <div class="xtx-form-item">
              <div class="label">邮政编码：</div>
              <div class="field">
              <input class="input"
               v-model="formData.postalCode"

              placeholder ="请输入邮政编码" />
              </div>
          </div>
          <div class="xtx-form-item">
              <div class="label">地址标签：</div>
              <div class="field">
              <input class="input"
               v-model="formData.addressTags"

              placeholder ="请输入地址标签，逗号分隔" />
              </div>
          </div>

           <div class="xtx-form-item">
              <div class="label">是否设置为默认地址</div>
              <xtx-checkbox v-model="formData.isDefaultSec" />
          </div>
        </div>
    </div>
    <template v-slot:footer>
      <XtxButton type="gray" style="margin-right:20px">取消</XtxButton>
      <XtxButton type="primary" @click="submit">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { addAddress, editAddress } from '@/api/order'
import Message from '@/components/library/Message'
export default {
  name: 'addressEdit',
  setup (props, { emit }) {
    const dialogVisible = ref(false)
    // 打开函数
    const open = (address) => {
      // 编辑 赋值
      if (address.id) {
        for (const key in formData) {
          formData[key] = address[key]
        }
      } else {
        // 添加 清空
        for (const key in formData) {
          if (key !== 'isDefault') {
            formData[key] = null
          }
        }
      }

      dialogVisible.value = true
    }

    // 表单数据
    const formData = reactive({
      id: null,
      fullLocation: null,
      receiver: null,
      contact: null,
      provinceCode: null,
      cityCode: null,
      countyCode: null,
      address: null,
      postalCode: null,
      addressTags: null,
      isDefault: 0,
      isDefaultSec: false
    })
    // 选择城市
    const changeCity = (data) => {
      formData.provinceCode = data.provinceCode
      formData.cityCode = data.cityCode
      formData.countyCode = data.countyCode
      formData.fullLocation = data.fullLocation
    }
    // 提交操作
    // 1. 添加时 设置默认值操作
    // 2.1 因为XtxCheckBox必须是true / false 而接口要求isDefault为0 或者 1
    // 2.2 如果当前添加地址要设置为 默认值 -> 判断isDefaultSec true isDefault 0
    // 2.3 调接口前进行判断
    // 3. 父组件 判断是否为1 如果为 1 设置 selectedArr 根据id 进行改变 赋值
    const submit = async () => {
      if (formData.id) {
        await editAddress(formData)
        Message({
          text: '编辑地址成功',
          type: 'success'
        })
        emit('on-success', formData)
        dialogVisible.value = false
      } else {
        const data = await addAddress(formData)
        formData.id = data.result.id
        // 添加成功提示
        Message({
          text: '添加地址成功',
          type: 'success'
        })
        // 添加的表单给父组件
        emit('on-success', formData)
        // 关闭弹框
        dialogVisible.value = false
      }
    }
    watch(() => formData.isDefaultSec, () => {
      // 如果formData.isDefaultSec 为true 就给 isDefault设置为 1 接口要求
      if (formData.isDefaultSec) {
        formData.isDefault = 1
      } else {
        formData.isDefault = 0
      }
    })
    return { dialogVisible, open, changeCity, submit, formData }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper){
    width: 780px;
    height: 650px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder
     {
      color: #ccc;
    }
  }
}
.isDefault {
  display: flex;
  align-items: center;
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder
     {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
