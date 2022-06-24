<template>
  <div class=''>
      <!-- 头部内容 -->
      <LoginHeader>联合登录</LoginHeader>
      <!-- 准备一个loading容器 -->
      <section class="container" v-if="isBind">
        <div class="unbind">
          <div class="loading"></div>
        </div>
      </section>
      <!-- 未绑定成功的容器 -->
      <section class="container" v-else>
            <nav class="tab">
                <a @click="hasAccount = true" :class="{active:hasAccount}" href="javascript:;">
                    <i class="iconfont icon-bind" />
                    <span>已有小兔鲜账号，请绑定手机</span>
                </a>
                <a @click="hasAccount = false" :class="{active:!hasAccount}" href="javascript:;">
                    <i class="iconfont icon-edit" />
                    <span>没有小兔鲜账号，请完善资料</span>
                </a>
            </nav>
            <div class="tab-content" v-if="hasAccount">
            <CallbackBind :unionId="unionId" />
            </div>
            <div class="tab-content" v-else>
            <CallbackPatch :unionId="unionId" />
            </div>
      </section>
      <!-- 尾部内容 -->
      <LoginFooter />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import CallbackBind from './components/callback-bind'
import CallbackPatch from './components/callback-patch'
import QC from 'qc'
import { userQQLogin } from '@/api/user'
import Message from '@/components/library/Message'
export default {
  name: 'PageCallback',
  components: {
    LoginHeader,
    LoginFooter,
    CallbackBind,
    CallbackPatch
  },
  setup() {
    // 1. 默认 认为有账号且绑定成功
    // 2. 每个QQ号 -> 对应一个openId -> 输入一个QQ号 扫码 -> 登录成功 去后台获取这个openId
    // 3. 拿到Id后，才能进行判断 是否和小兔鲜的账号绑定成功 -> 成功 -> 就直接跳转到登录
    // 4. 失败 -> 有小兔鲜账号 ? 进行绑定
    //    失败 -> 无小兔鲜账号 ? 完善账号的信息
    const hasAccount = ref(true)
    const router = useRouter()
    const store = useStore()
    // 认为有账号且绑定成功
    const isBind = ref(true)
    // unionId
    const unionId = ref('')
    if (QC.Login.check()) {
      QC.Login.getMe(openId => {
        // console.log(openId) // B05B22D058F342E1D717A843A0195A60
        unionId.value = openId
        userQQLogin(openId).then(data => {
          // 保存用户信息
          const { account, mobile, avatar, nickname, token, id } = data.result
          store.commit('user/setUser', { account, mobile, avatar, nickname, token, id })

          // // 登录成功：data.result 用户信息
          // router.push(store.state.user.redirectUrl)
          // // 成功的提示
          // Message({
          //   type: 'success',
          //   text: 'QQ登录成功'
          // })

          // 合并修改 合并购物车 提示+跳转
          store.dispatch('cart/mergeLocalCart').then(() => {
            // 提示用户登录成功
            Message({ text: '登录成功', type: 'success' })
            // 强调一遍route.query.redirectUrl 或者是跳转到'/'
            router.push(store.state.user.redirectUrl)
          })
        }).catch(e => {
          isBind.value = false
          // 登录失败：没有和小兔鲜绑定
        })
      })
    }
    return {
      hasAccount,
      isBind,
      unionId
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  position: relative;
  height: 750px;
  padding: 25px 0;
   .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
