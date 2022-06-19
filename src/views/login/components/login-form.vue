<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="changeLogin('account')" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="changeLogin('message')" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form
    class="form"
    :validation-schema="schema"
    v-slot="{errors}"
    ref="formCom"
    >
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
            :class="{error: errors.account}"
            name="account"
            type="text"
            placeholder="请输入用户名"
            v-model="form.account"
            autocomplete="off"
            />
          </div>
          <div v-if="errors.account" class="error"><i class="iconfont icon-warning" />
            {{errors.account}}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
            :class="{error: errors.password}"
            name="password"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
            v-model="form.password"
            />
          </div>
          <div v-if="errors.password" class="error"><i class="iconfont icon-warning" />
            {{errors.password}}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error: errors.mobile}" name="mobile" type="text" placeholder="请输入手机号"
            v-model="form.mobile"
             />
          </div>
          <div v-if="errors.mobile" class="error"><i class="iconfont icon-warning" />
            {{errors.mobile}}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field :class="{error: errors.code}" name="code" type="password" placeholder="请输入验证码"
            v-model="form.code"
            autocomplete="off"
            />
            <!-- <span v-if="time === 0" class="code" @click="send">发送验证码</span> -->
            <!-- <span v-else class="code">{{ time }}</span> -->
            <span class="code" @click="send">
              {{time === 0 ? '发送验证码' : `${time}后再次发送`}}
            </span>
          </div>
          <div v-if="errors.code" class="error"><i class="iconfont icon-warning" />
            {{ errors.code }}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field
          as="xtx-checkbox"
          name="isAgree"
          v-model="form.isAgree"
          :class="{error: errors.isAgree}"
          />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div v-if="errors.isAgree && agreeFlag" class="error"><i class="iconfont icon-warning" />
            {{errors.isAgree}}
        </div>
      </div>
      <a href="javascript:;" class="btn" @click="submit()">登录</a>
    </Form>
    <div class="action">
      <!-- <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt=""> -->
      <!--
        1、 下面span以及小图标是QC全局变量渲染出来的 id - 进行容器对应
        2、 但是会打开新的窗口 以及扫码跳转也会跳转到新的窗口
       -->
      <!-- <span id="qqLoginBtn"></span> -->
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback" >
         <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { onUnmounted, reactive, ref, watch } from 'vue'
import { Field, Form } from 'vee-validate'
import mySchema from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'
import { userAccountLogin, userMobileLogin, userMobileLoginMsg } from '@/api/user'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useIntervalFn } from '@vueuse/core'
// 引入这个包 但是并没有npm run qc这个包 只要有import webpack就会打包 因此需要webpack打包的时候忽略qc包
// import QC from 'qc'
export default {
  name: 'LoginForm',
  components: {
    Field,
    Form
  },
  setup() {
    // 是否是短信登录
    const isMsgLogin = ref(false)
    const form = reactive({
      isAgree: false,
      account: null,
      password: null,
      mobile: null,
      code: null
    })
    const schema = {
      account: mySchema.account,
      password: mySchema.password,
      mobile: mySchema.mobile,
      code: mySchema.code,
      isAgree: mySchema.isAgree
    }
    // 表单Form的ref值
    const formCom = ref(null)
    watch(() => isMsgLogin, () => {
      // 清除表单
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      form.isAgree = false
      agreeFlag.value = false
      // 清除校验效果
      // formCom.value.resetForm()
    })

    // 改变登录状态
    const changeLogin = (type) => {
      if (type === 'account') {
        isMsgLogin.value = false
      } else if (type === 'message') {
        isMsgLogin.value = true
      }
    }
    // 这个判断条件给 “同意用户协议” 使用 使得初始进入页面 能够不触发校验条件
    const agreeFlag = ref(false)
    // const login = async () => {
    //   try {
    //     const res = await formCom.value.validate()
    //     agreeFlag.value = true
    //     console.log(res) // 打印是false 未能够校验成功
    //     Message({ type: 'success', text: '登录成功' })
    //   } catch (error) {
    //     console.log(error)
    //     Message({ type: 'error', text: '登录失败' })
    //   }
    // }
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    // LoginForm的ref值
    const data = null
    // 1. 点击登录
    const submit = async () => {
      // 1. 整体校验 如果校验成功 执行登录逻辑
      // 2. 校验失败 不继续
      const valid = await formCom.value.validate()
      if (valid) {
        try {
          // 如果是用户名登录
          let data
          if (!isMsgLogin.value) {
            // 3. 调用接口 传递form信息
            //    接受数据 存储用户信息
            //    页面跳转 要么跳转到来源页 要么跳转到登录页面
            const { account, password } = form
            data = await userAccountLogin({ account, password })
          } else {
            const { mobile, code } = form
            data = await userMobileLogin({ mobile, code })
          }
          // 解构出用户信息
          const { account, mobile, avatar, nickname, token, id } = data.result
          // 修改用户信息
          store.commit('user/setUser', { mobile, avatar, nickname, token, id, account })
          // 提示用户登录成功
          Message({ text: '登录成功', type: 'success' })
          // 强调一遍route.query.redirectUrl 或者是跳转到'/'
          router.push(route.query.redirectUrl || '/')
        } catch (error) {
          if (error) {
            Message({ text: error.response.data.message, type: 'error' })
          }
        }
      }
    }
    // 2. 点击发送验证码
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
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过校验
        if (time.value === 0) {
          // 没有倒计时才可以发送
          await userMobileLoginMsg(form.mobile)
          // 发送成功消息
          Message({
            type: 'success',
            text: '发送成功'
          })
          time.value = 60 // 重置time计时器
          resume() // 重新开始计时
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError('mobile', valid)
        debugger
      }
    }
    // 4. 组件初始化 挂载页面
    // onMounted(() => {
    //   QC.Login({
    //     btnId: 'qqLoginBtn'
    //   })
    // })
    return {
      form,
      isMsgLogin,
      schema,
      formCom,
      agreeFlag,
      submit,
      data,
      send,
      time,
      changeLogin
    }
  }
}
</script>

<style scoped lang="less">
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
