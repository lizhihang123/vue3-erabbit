import { topCategory } from '@/api/constant'
import { findAllCategory } from '@/api/catagory'
export default {
  namespaced: true,
  // state 高命名空间写成函数形式
  state: () => {
    return {
      // list是写死的数据 和 后台约定防止 白屏
      // 利用map 方法进行处理 转字符串为对象 后续需要key value形式
      list: topCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    setList(state, payload) {
      state.list = payload
    },
    // 修改当前一级分类下的open数据为true
    show(state, item) {
      const category = state.list.find(category => category.id === item.id)
      category.open = true
    },
    hide(state, item) {
      const category = state.list.find(category => category.id === item.id)
      category.open = false
    }
  },
  actions: {
    // 可以写context 也可以写成 {commit}
    async getCategory(context) {
      const { result } = await findAllCategory()
      result.forEach(item => {
        item.open = false
      })
      context.commit('setList', result)
      console.log(result)
    }
  }
}
