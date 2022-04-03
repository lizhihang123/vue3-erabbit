import { createStore } from 'vuex'

const moduleA = {
  // 子模块的state建议写成函数
  state: () => {
    return {
      username: 'xiaohang'
    }
  },
  getters: {
    changeName(state) {
      return state.username + '!!'
    }
  },
  mutations: {
    changeA(state, payload) {
      state.username = payload
    }
  },
  actions: {
    updateA({ commit }) {
      setTimeout(() => {
        commit('changeA', 'wangwu')
      }, 1000)
    }
  }
}
const moduleB = {
  namespaced: true,
  state: () => {
    return {
      usernameB: 'maiqi'
    }
  },
  getters: {
    changeNameB(state) {
      return state.usernameB + '!!'
    }
  },
  mutations: {
    changeB(state, payload) {
      state.usernameB = payload
    }
  },
  actions: {
    updateB({ commit }) {
      setTimeout(() => {
        commit('changeB', 'wangwu')
      }, 1000)
    }
  }
}

// vue2.0 new Vuex.store({})
// vue3.0 createStore({})
export default createStore({
  state: {
    userName: 'zs'
  },
  getters: {
    getUserName(state) {
      return state.userName + '!!!'
    }
  },
  mutations: {
    updateUserName(state, payload) {
      state.userName = payload
    }
  },
  actions: {
    updateUserName(context) {
      setTimeout(() => {
        context.commit('updateUserName', 'wangwu')
        console.log(context.state.userName)
        // actions里面的context可以获取其它的state mutations 或者是actions
      }, 1000)
    }
  },
  modules: {
    a: moduleA,
    b: moduleB
  }
})
