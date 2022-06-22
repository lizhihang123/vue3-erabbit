// 实现使用函数时 调用弹框组件的逻辑
import XtxMessage from './xtx-message.vue'
import { createVNode, render } from 'vue'

// 准备一个dom容器 把虚拟节点渲染到DOM容器里面去
const div = document.createElement('div')
// 给div设置类名
div.setAttribute('class', 'xtx-message-container')
// div放到页面上去
document.body.appendChild(div)

// 定时器标识
let timer = null

// 导出函数 这个函数可以传递 type, text 两个参数
export default ({ type, text }) => {
  // 0. 导入组件
  // 1. 根据组件创建虚拟节点
  // 参数1 组件实例
  // 参数2 传递的参数
  const vnode = createVNode(XtxMessage, { type, text })
  // 2. 准备一个dom容器 在上面
  // 3. 把虚拟节点渲染到dom容器里面去 vue的虚拟节点必须vue来进行渲染
  render(vnode, div)
  // 关闭定时器 是个好习惯
  clearTimeout(timer)
  // 目的-》3s后能够把null渲染到div里面去，这里弹框就会看不出显示
  timer = setTimeout(() => {
    render(null, div)
  }, 1000)
}
