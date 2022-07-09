import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { onUnmounted, ref } from 'vue'
import dayjs from 'dayjs'
// 懒加载
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

// 支付倒计时
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')
  // 1. 解构出pause 和 resume 两个函数
  // 2. 如果time小于0 就暂停，
  // 3. 参数1是要执行的函数 参数2是每隔1秒执行一次 参数3不是立即执行
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    // dayjs.unix
    // dayjs.unix(time.value).format('mm分ss秒')
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, false)
  // 组件销毁时 暂停
  onUnmounted(() => {
    pause()
  })
  // 开启定时器countdown倒计时时间
  const start = (countdown) => {
    time.value = countdown
    // 这句代码加 与 不加 差别很大
    // 能够解决 是否显示白屏的问题
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    // 唯一的错误就是  timeText.value = timeText.value.dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  return {
    start,
    timeText
  }
}
