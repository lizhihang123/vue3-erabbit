<template>
  <router-view></router-view>
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
</style>
