import { createVNode, render } from 'vue'
import XtxConfirm from './xtx-confirm.vue'

// 1. 创建容器
const div = document.createElement('div')
// 1.1 设置自定义属性
div.setAttribute('class', 'xtx-confirm-container')
// 1.2 插入到页面上
document.body.appendChild(div)

export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    // 确认的回调
    const submitCallback = () => {
      // 销毁组件
      // null 渲染给 div - 销毁组件
      render(null, div)
      // 写resolve 表示到时能够接受then的回调
      resolve()
    }
    // 取消的回调
    const cancellCallback = () => {
      // 销毁组件
      // null 渲染给 div  - 销毁组件
      render(null, div)
      // 写reject 表示到时能够接受catch的回调
      reject(new Error('点击取消'))
    }

    // 2. 创建虚拟节点
    // 参数1 组件实例
    // 参数2 传递的参数
    const VNode = createVNode(XtxConfirm, { title, text, submitCallback, cancellCallback })
    render(VNode, div)
  })
}
