<template>
  <div>
    App {{$store.state.user.profile.account}}
    <button @click="$store.commit('user/setUser', {account: 'zhangsan'})">点击改变值</button>
    App<button @click="fn">点击发送请求</button>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  setup() {
    const fn = () => {
      request('/haha', 'get', { a: 10 })
    }
    return { fn }
  }
}
</script>

<style>
</style>
