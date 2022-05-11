<template>
  <router-view></router-view>
  <Transition>
    <div class="test" v-show="show"></div>
  </Transition>
  <Transition name="good">
    <div class="test" v-show="show"></div>
  </Transition>
  <button  @click="show = false">点击离开</button>
  <button  @click="show = true">点击显示</button>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const show = ref(true)
    return { show }
  }
}
</script>

<style lang="less">
// 1. 进入(显示, 创建)
// 进入前 v-enter(vue3.0 v-enter-from)
// 进入中 v-enter-active
// 进入后 v-enter-to

// 2. 离开 (隐藏, 移除)
// 离开前 v-leave(vue3.0 v-leave-to)
// 离开中 v-leave-active
// 离开后 v-leave-to
.test {
  width: 100px;
  height: 100px;
  background-color: pink;
}
.v-enter {
  opacity: 0;
}
.v-enter-active {
  transition: all .3s;
}
.v-enter-to {
  opacity: 1;
}

.v-leave {
  opacity: 1;
}
.v-leave-active {
  transition: all 1s;
}
.v-leave-to {
  opacity: 0;
}

.good-enter {
  height: 0;
}
.good-enter-active {
  transition: all .3s;
}
.good-enter-to {
  height: 100px;
}

.good-leave {
  height: 100px;
}
.good-leave-active {
  transition: all 1s;
}
.good-leave-to {
  height: 0;
}
</style>
