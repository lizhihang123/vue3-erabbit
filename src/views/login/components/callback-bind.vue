<template>
  <Form ref="formCom" class="xtx-form" :validation-schema="schema" autocomplete="off" v-slot="{ errors }">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{nickName}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err: errors.mobile}" v-model="form.mobile" name="mobile" class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div class="error" v-if="errors.mobile">
        {{errors.mobile}}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err: errors.code}" v-model="form.code" name="code" class="input" type="text" placeholder="短信验证码" />
        <span class="code" @click="send">
              {{time === 0 ? '发送验证码' : `${time}后再次发送`}}
            </span>
      </div>
      <div class="error" v-if="errors.code">
        {{errors.code}}
      </div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即绑定</a>
  </Form>
</template>

<script>
import { ref, reactive, onUnmounted } from 'vue'
import QC from 'qc'
import { Field, Form } from 'vee-validate'
import mySchema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
export default {
  name: 'CallbackBind',
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  components: {
    Field,
    Form
  },
  setup(props) {
    // 1. 准备用户的信息 openId【父传子传进】 code mobile
    const avatar = ref('')
    const nickName = ref('')
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        avatar.value = res.data.figureurl_1
        nickName.value = res.data.nickname
      })
    }
    // 表单数据对象
    const form = reactive({
      mobile: '',
      code: ''
    })
    // 我的校验规则
    const schema = {
      mobile: mySchema.mobile,
      code: mySchema.code
    }

    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    // 组件销毁时，暂停计时
    onUnmounted(() => {
      pause()
    })
    // formCom
    const formCom = ref(null)
    // 发送验证码
    const send = async () => {
      // 发送验证码之前 先校验一遍表单
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过校验 且倒计时是0 才能再次发送
        if (time.value === 0) {
          // 没有倒计时才可以发送
          const { mobile } = form
          await userQQBindCode(mobile)
          // 发送成功消息
          Message({
            type: 'success',
            text: '发送成功'
          })
          time.value = 60 // 重置time计时器
          resume() // 重新开始计时
        }
      } else {
        formCom.value.setFieldError('mobile', valid)
      }
    }
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const submit = () => {
      // validate - 表单整体校验
      const valid = formCom.value.validate()
      console.log(props.unionId, form.mobile, form.code)
      if (valid) {
        userQQBindLogin({
          unionId: props.unionId,
          ...form
        }).then(data => {
          console.log(data)
          // 如果数据请求成功
          // 1. 解构数据
          const { account, mobile, avatar, nickname, token, id } = data.result
          // 2. 存数据
          store.commit('user/setUser', { mobile, avatar, nickname, token, id, account })

          // // 3. 成功提示
          // Message({ text: '登录成功', type: 'success' })
          // // 4. 路由跳转
          // // 跳转到记录的重定向地址 或者是首页
          // router.push(route.query.redirectUrl || '/')

          // // 合并修改 合并购物车 提示+跳转
          store.dispatch('cart/mergeLocalCart').then(() => {
            // 提示用户登录成功
            Message({ text: '登录成功', type: 'success' })
            // 强调一遍route.query.redirectUrl 或者是跳转到'/'
            router.push(route.query.redirectUrl || '/')
          })
        }).catch((error) => {
          Message({
            text: error.response.data.message,
            type: 'error'
          })
        })
      }
    }
    return {
      avatar,
      nickName,
      form,
      schema,
      send,
      formCom,
      time,
      submit
    }
  }
}
</script>

<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
.code {
position: absolute;
right: 0;
top: 0;
line-height: 50px;
width: 80px;
color: #999;
    &:hover {
        cursor: pointer;
    }
}
// 表单
.xtx-form {
  padding: 50px 0;
  &-item {
    display: flex;
    align-items: center;
    width: 700px;
    margin: 0 auto;
    padding-bottom: 25px;
    .label {
      width: 180px;
      padding-right: 10px;
      text-align: right;
      color: #999;
      ~ .field {
        margin-left: 0;
      }
    }
    .field {
      width: 320px;
      height: 50px;
      position: relative;
      margin-left: 190px;
      .icon {
        position: absolute;
        left: 0;
        top: 0;
        width: 40px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        color: #999;
        ~ .input {
          padding-left: 40px;
        }
      }
      .input{
        border: 1px solid #e4e4e4;
        width: 320px;
        height: 50px;
        line-height: 50px;
        padding: 0 10px;
        &.err {
          border-color: @priceColor;
        }
        &:focus,&:active{
          border-color: @xtxColor;
        }
      }
    }
    .error {
      width: 180px;
      padding-left: 10px;
      color: @priceColor;
    }
  }
  .submit {
    width: 320px;
    height: 50px;
    border-radius: 4px;
    background: @xtxColor;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    color: #fff;
    display: block;
    margin: 0 auto;
  }
}
</style>
