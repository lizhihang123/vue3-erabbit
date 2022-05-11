<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem v-if="category.top" :to="`/category/${category.top.id}`">{{category.top.name}}</XtxBreadItem>
    <Transition name="fade-right" mode="out-in">
      <XtxBreadItem v-if="category.sub" :key="category.sub.id">{{category.sub.name}}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>
<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
export default {
  name: 'SubBread',
  setup () {
    const store = useStore()
    const route = useRoute()
    const category = computed(() => {
      const obj = {}
      store.state.category.list.forEach(top => {
        if (top.children) {
          const cate = top.children.find(item => {
            return item.id === route.params.id
          })
          if (cate) {
            obj.top = { name: top.name, id: top.id }
            obj.sub = { name: cate.name, id: cate.id }
          }
        }
      })
      return obj
    })
    return {
      category
    }
  }
}
</script>
<style scoped lang="less">
</style>
