<template>
  <!-- 1. state使用 -->
  <div>{{ $store.state.userName }}</div>
  <!-- 2. computed的使用 -->
  <div>{{ $store.getters.getUserName }}</div>
  <!-- 3. mutations使用 -->
  <button @click="$store.commit('updateUserName', 'xiaohang')">
    改变userName的值
  </button>
  <!-- 4. actions的使用 -->
  <button @click="$store.dispatch('updateUserName')">
    点击调用actions改变userName的值
  </button>

  <button @click="updateUserName">点击setup里面触发mutations和 1s后触发 actions</button>

   <!-- 5. 命名空间的区分 -->
  <div>5. 命名空间的区分 </div>
  <div>state {{$store.state.a.username}}</div>
  <div>getters {{$store.getters.changeName}}</div>
  <button @click="$store.commit('changeA', '123')">点击改变模块A的name 通过mutations</button>
  <button @click="$store.dispatch('updateA')">点击改变模块A的name 通过acttions</button>
  <button @click="updateUserName2">点击在setup里面触发模块A的mutations和actions</button>

  <hr />
  <!-- 6. 加锁的命名空间 -->
  <div>6. 加锁的命名空间</div>
  <div>state {{$store.state.b.usernameB}}</div>
  <div>getters {{$store.getters['b/changeNameB']}}</div>
  <button @click="$store.commit('b/changeB', '123')">点击改变模块B的name 通过mutations</button>
  <button @click="$store.dispatch('b/updateB')">点击改变模块B的name 通过acttions</button>
  <button @click="updateUserName3">点击在setup里面触发模块B的mutations和actions</button>
</template>

<script>
import { useStore } from 'vuex'
export default {
  name: 'App',
  setup() {
    // 1. 基本测试
    const store = useStore()
    console.log(store.state.userName)
    console.log(store.getters.getUserName)
    const updateUserName = () => {
      store.commit('updateUserName', '123')
      store.dispatch('updateUserName', 'wangwu')
    }

    // 2. 命名空间的测试
    // 不开启命名空间
    const updateUserName2 = () => {
      // store.commit('changeA', 'wangwu')
      store.dispatch('updateA', 'lisi')
    }

    // 3. 开启命名空间
    const updateUserName3 = () => {
      // store.commit('b/changeB', 'wangwu')
      store.dispatch('b/updateB', 'lisi')
    }
    return { updateUserName, updateUserName2, updateUserName3 }
  }
}
</script>

<style lang="less">
</style>
