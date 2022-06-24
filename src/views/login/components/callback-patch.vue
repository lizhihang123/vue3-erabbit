<template>
  <Form ref="formCom" class="xtx-form" :validation-schema="schema" v-slot="{errors}">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <!-- 这里的name 还是account 只是下面的校验规则要改一改 -->
        <Field name="account" v-model="form.account" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div class="error" v-if="errors.account">
         {{errors.account}}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field name="mobile" v-model="form.mobile" class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div class="error" v-if="errors.mobile">
         {{errors.mobile}}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field name="code" v-model="form.code" class="input" type="text" placeholder="请输入验证码" />
        <span class="code" @click="send">
          {{time === 0 ? '发送验证码' : `${time}后发送`}}
        </span>
      </div>
      <div class="error">
         {{errors.code}}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field name="password" v-model="form.password" class="input" type="password" placeholder="请输入密码" autocomplete="off"/>
      </div>
      <div class="error" v-if="errors.password">
         {{errors.password}}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field name="rePassword" v-model="form.rePassword"  class="input" type="password" placeholder="请确认密码" autocomplete="off" />
      </div>
      <div class="error" v-if="errors.rePassword">
         {{errors.rePassword}}
      </div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
import { Field, Form } from 'vee-validate'
import { reactive, ref, onUnmounted } from 'vue'
import mySchema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { userPatchLogin, userQQPatchLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
export default {
  name: 'CallbackPatch',
  components: {
    Field,
    Form
  },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 1. 表单校验
    // 1.1 基础的校验 ok
    // 1.2 用户名是否重复 确认密码 要额外注意  ok
    // 2. 发送验证码
    // 2.1 和之前的一样的发送验证码的方式 发送验证码时校验格式对不对
    // 3. 点击 绑定
    // 3.1 发送接口
    // 4. 有接口 能够解绑账号

    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })
    const schema = {
      account: mySchema.accountApi,
      mobile: mySchema.mobile,
      code: mySchema.code,
      password: mySchema.password,
      rePassword: mySchema.rePassword
    }

    // 发送验证码
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
          try {
            await userPatchLogin(mobile)
            // 发送成功消息
            Message({
              type: 'success',
              text: '发送成功'
            })
            time.value = 60 // 重置time计时器
            resume() // 重新开始计时
          } catch (error) {
            Message({
              type: 'error',
              text: '发送失败，请检查格式或该手机号已被注册'
            })
            time.value = 0 // 这时不能够计时
            // pause()
          }
        }
      } else {
        formCom.value.setFieldError('mobile', valid)
      }
    }

    // 点击登录提交绑定
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const submit = () => {
      // validate - 表单整体校验
      const valid = formCom.value.validate()
      console.log(props.unionId, form.mobile, form.code)
      if (valid) {
        userQQPatchLogin({
          unionId: props.unionId,
          ...form
        }).then(data => {
          console.log(data)
          // 如果数据请求成功
          // 1. 解构数据
          const { account, mobile, avatar, nickname, token, id } = data.result
          // 2. 存数据
          store.commit('user/setUser', { mobile, avatar, nickname, token, id, account })

          // // 3. 提示成功
          // Message({ text: '登录成功', type: 'success' })
          // // 4. 路由跳转
          // // 跳转到记录的重定向地址 或者是首页
          // router.push(route.query.redirectUrl || '/')

          // 购物车合并修改 合并购物车 提示+跳转
          store.dispatch('cart/mergeLocalCart').then(() => {
            // 提示用户登录成功
            Message({ text: '登录成功', type: 'success' })
            // 强调一遍route.query.redirectUrl 或者是跳转到'/'
            router.push(route.query.redirectUrl || '/')
          })
        }).catch((error) => {
          Message({
            text: error.message,
            type: 'error'
          })
        })
      }
    }
    return {
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
</style>
