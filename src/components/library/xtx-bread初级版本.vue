<template>
  <div class='xtx-bread'>
    <div class="xtx-bread-item">
      <RouterLink to="/">首页</RouterLink>
    </div>
    <i class="iconfont icon-angle-right"></i>
    <!-- parentName - 是父级的类名 -->
    <!-- parentPath - 父级 点进去 能够跳转到哪一级路由 如果没有 说明没有子路由 -->
    <div class="xtx-bread-item" v-if="parentName">
      <RouterLink v-if="parentPath" :to="parentPath">{{parentName}}</RouterLink>
      <span v-else>{{parentName}}</span>
    </div>
    <i v-if="parentPath" class="iconfont icon-angle-right"></i>
    <div class="xtx-bread-item" v-if="parentName">
      <span><slot /></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'XtxBreadFirst',
  props: {
    parentPath: {
      type: [String, Object],
      default: ''
    },
    parentName: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang='less'>
.xtx-bread{
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all .4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>
