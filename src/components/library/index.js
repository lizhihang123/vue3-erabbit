// 插件: 扩展vue原有的功能, 自定义指令、组件、方法
// 但是vue3 没有过滤器 过滤器本质就是方法

// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

// import xtxSkeleton from './xtx-skeleton.vue'
// import xtxCarousel from './xtx-carousel.vue'
// import xtxMore from './xtx-more.vue'
// import xtxBread from './xtx-bread.vue'
// import xtxBreadItem from './xtx-bread-item.vue'
import defaultImg from '@/assets/images/200.png'

// 自定义指令
const defineDirective = (app) => {
  app.directive('lazy', {
    mounted(el, binding) {
      // el => 监听的dom元素 给哪个dom绑定的自定义zhi8ling
      // binding => 给自定义指令赋值
      // observer是监听的实例
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        // isIntersecting是判断是否进入可视区
        if (isIntersecting) {
          // 如果进入 停止监听 不然触发多次
          observer.unobserve(el)
          // binding => 对象 binding.value 才是给自定义的值 是src地址

          // 如果图片加载出错 onerror事件触发 下面onerror就会执行
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
        // observer.observe(el) // 写在这里是错误的
      },
      {
        threshold: 0.01
      })
      // 实例创建后 在外面进行监视
      // 不是在实例里面 开启监视
      observer.observe(el)
    }
  })
}
const importFn = require.context('./', false, /\.vue$/)
export default {
  install(app) {
    // 这里注册 表示全局的组件
    // app.component(xtxSkeleton.name, xtxSkeleton)
    // app.component(xtxCarousel.name, xtxCarousel)
    // app.component(xtxMore.name, xtxMore)
    // app.component(xtxBread.name, xtxBread)
    // app.component(xtxBreadItem.name, xtxBreadItem)
    importFn.keys().forEach(key => {
      const component = importFn(key).default
      app.component(component.name, component)
    })
    defineDirective(app)
  }
}
