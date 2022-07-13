<script>
import { provide } from 'vue'
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    // activeName 实现双向数据的绑定
    const activeName = useVModel(props, 'modelValue', emit)
    provide('activeName', activeName)
    const tabClick = (name, index) => {
      activeName.value = name
      // 暴露一个 tab-click事件
      emit('tab-click', { name, index })
    }
    return {
      activeName,
      tabClick
    }
  },
  render() {
    const panels = this.$slots.default()
    // render函数里面必须有返回值
    // const nav = <nav>
    //   <a href="javascript:;" class="active" onClick="">选项卡1</a>
    //   <a href="javascript:;">选项卡2</a>
    //   <a href="javascript:;">选项卡3</a>
    // </nav>
    const dynamicPanel = []
    panels.forEach((item, i) => {
      if (item.type.name === 'XtxTabPanel') {
        dynamicPanel.push(item)
      } else {
        Array.isArray(item.children) && item.children.forEach((child, index) => {
          // ! 这里卡住了
          dynamicPanel.push(child)
        })
      }
    })

    //
    // 注意map 返回的是一个数组
    const nav = <nav>
      {
        dynamicPanel.map((item, i) => {
          // 这个里面也要用{}
          // 注意modelValue 可以通过this直接访问到
          // 动态class 需要加双{} 一个{} 标识JSX语法，两个表示是一个对象
          return <a onClick={() => this.tabClick(item.props.name, i)} class={{ active: item.props.name === this.activeName }}>{item.props.label}
          </a>
        })
      }
    </nav>
    return <div class="xtx-tabs">{[nav, dynamicPanel]}</div>
  }
}
</script>

<style scoped lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
