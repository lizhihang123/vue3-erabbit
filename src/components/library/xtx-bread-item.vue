<template>
    <div class="xtx-bread-item">
      <RouterLink :to="to" v-if="to"><slot /></RouterLink>
      <span v-else><slot /></span>
    </div>
</template>

<script>
export default {
  name: 'XtxBreadItem',
  props: {
    to: {
      type: [String, Object],
      default: '/'
    },
    parentName: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang='less'>

</style>
