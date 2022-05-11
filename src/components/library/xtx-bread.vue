<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render() {
    // 获取所有的插槽内容
    const items = this.$slots.default()
    const DynamicItems = []
    items.forEach((item, i) => {
      DynamicItems.push(item)
      if (i < (items.length - 1)) {
        DynamicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    return h('div', { class: 'xtx-bread' }, DynamicItems)
  }
}
</script>

<style lang='less'>
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
