export default {
  namespaced: true,
  state() {
    return {
      profile: {
        id: '',
        avator: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      },
      name: 'ls'
    }
  },
  mutations: {
    /**
       * @name: 修改用户信息的函数
       * @test: test font
       * @msg:
       * @param {*} stuserMobileLoginMsgate
       * @param {*} payload
       * @return {*}
       */
    setUser(state, payload) {
      state.profile = payload
    }
  }
}
