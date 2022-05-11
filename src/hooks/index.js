import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
export const useLazyData = (apiFn) => {
  const target = ref(null)
  const result = ref([])
  const { stop } = useIntersectionObserver(
    // 1. 观察的目标dom容器 必须是vue3声明的ref响应式数据
    // 不需要传入 我们自己声明
    target,
    ([{ isIntersecting }], observerElement) => {
      // isIntersecting 是布尔值 是否进入可视区
      // element 是被观察的dom容器
      if (isIntersecting) {
        // 如果进入可视区 就停止监视 为什么？ 没必要监视了 直接给数据好了
        stop()
        // 调用接口 获取数据 接口参数是要传递进来的
        apiFn().then(data => {
        //   result 是接受的数据的，最终要给页面响应
        //   data.result 是接口返回的数据
          result.value = data.result
        })
      }
    }
  )
  return { result, target }
}
