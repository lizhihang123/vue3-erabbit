<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  name: 'XtxTabs2',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const activeName = useVModel(props, 'modelValue', emit)
    // 传值给tab-panel
    provide('activeName', activeName)
    // 点击选项卡对应的处理函数
    const tabClick = (name, index) => {
      activeName.value = name
      emit('tab-click', { name, index })
    }
    return {
      tabClick,
      activeName
    }
  }
  // render创建组件是jsx语法，他能够让我们创建节点和写html一样
  // 1. 动态插值表达式 {}
  // 2. 尽量用三元表达式去做判断 使用map来遍历
  // 3. 事件使用原始的方式绑定
  // render () {
  //   // 默认插槽节点
  //   const panels = this.$slots.default()
  //   console.log(panels)

  //   const dynamicPanel = []
  //   panels.forEach(item => {
  //     if (item.type.name === 'XtxTabsPanel') {
  //       dynamicPanel.push(item)
  //     } else {
  //       item.children.forEach(com => {
  //         dynamicPanel.push(com)
  //       })
  //     }
  //   })

  //   // nav
  //   const nav = (
  //     <nav>
  //       {dynamicPanel.map((item, i) => {
  //         return (
  //           <a
  //             // 这里着实看不懂而来
  //             onClick = {() => this.tabClick(item.props.name, i)}
  //             class={{ activeName: item.props.name === this.activeName }}
  //             href="javascript:;"
  //           >
  //             {item.props.label }
  //           </a>
  //         )
  //       })}
  //     </nav>
  //   )
  //   // return <div class="xtx-tabs">{{ nav, panels }}</div>

  //   const name = 'tom'
  //   const title = 'tom 12'
  //   const hi = () => {
  //     console.log('你好')
  //   }
  //   const sub = [<sub>123</sub>, <sub>456</sub>]
  //   return <h1 title={title} onClick={hi}>{ name } {sub}</h1>
  // }
}
</script>

<style lang="less" scoped>
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
