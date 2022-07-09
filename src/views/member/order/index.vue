<template>
  <div class='member-order-page'>
    <!-- <XtxTabs v-model="activeName" @click-tab="clickTab">
      <XtxTabsPanel
      v-for="(item, index) in orderStatus"
      :key="index" :name="item.name"
      :label="item.label">
        {{item.label}}
      </XtxTabsPanel>
    </XtxTabs> -->
    <XtxTabs v-model="activeName" @tab-click="fn">
      <XtxTabPanel label="选项卡0" name="内容0">内容0</XtxTabPanel>
      <XtxTabPanel v-for="i in 4" :key="i" :label="`选项卡${i}`" :name="`内容${i}`">内容{{i}}</XtxTabPanel>
      <!-- <XtxTabPanel label="选项卡2" name="内容2">内容2</XtxTabPanel>
      <XtxTabPanel label="选项卡3" name="内容3">内容3</XtxTabPanel>
      <XtxTabPanel label="选项卡4" name="内容4">内容4</XtxTabPanel> -->
    </XtxTabs>
  </div>
</template>

<script>
import { ref } from 'vue'
import { orderStatus } from '@/api/constant'
export default {
  name: 'memberOrder',
  setup () {
    const activeName = ref('内容1')
    const clickTab = (name) => {
      console.log(name)
    }
    // const fn = (item, index) => {
    //   console.log(item, index)
    // }
    return {
      activeName,
      clickTab,
      orderStatus
    }
  }
}
</script>

<style scoped lang='less'>

</style>
