<template>
  <div class='HomeTest'>
    {{ a }}
    <span class="test">我来测试css变量语法</span>
    <slot />
  </div>
</template>

<script setup>
const a = 10
const xtxColor = 'pink'
</script>

<style scoped lang='less'>
.test {
    color: v-bind(xtxColor);
}
:slotted(.good) {
    color: red;
}
:global(.test) {
    color: blue;
}
</style>
